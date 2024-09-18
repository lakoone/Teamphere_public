import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../../auth/auth.service';
import { forwardRef, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatService } from '../../chat/chat.service';
import { writeLog } from '../../helpers/log';
import { MessageDTO } from '../../message/dto/message.dto';
import Redis from 'ioredis';
import { CreateMessageDto } from '../../message/dto/create-message.dto';
import { v4 as uuidv4 } from 'uuid';
import { QueueService } from '../../queue/message-queue.service';
import * as chalk from 'chalk';
import { NotificationGateway } from '../notification/NotificationGateway.service';
import * as process from 'process';

const chatsServiceBgColor = chalk.bgMagentaBright.black;
const chatsServiceTextColor = chalk.magentaBright;

@WebSocketGateway({
  namespace: 'api/chat',
  cors: {
    origin: `${process.env.STATUS === 'prod' ? process.env.HOST_DOMAIN : 'http://localhost:3000'}`,
    credentials: true,
  },
})
export class ChatsGateway
  implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private redisClient: Redis;

  constructor(
    @Inject(forwardRef(() => ChatService))
    private chatService: ChatService,
    private readonly auth: AuthService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => NotificationGateway))
    private notificationGateway: NotificationGateway,
    private queueService: QueueService,
  ) {
    console.log(
      'CHAT GATEWAY CONSTURCTOR CORS : ',
      `${process.env.STATUS === 'prod' ? process.env.HOST_DOMAIN : 'http://localhost:3000'}`,
    );
    const redisHost = this.configService.get<string>('REDIS_HOST');
    const redisPort = this.configService.get<number>('REDIS_PORT');
    this.redisClient = new Redis({ host: redisHost, port: redisPort });
    this.redisClient.on('connect', () => {
      console.log('ChatsGateway connected to Redis');
    });

    this.redisClient.on('error', (err) => {
      console.log('ChatsGateway Redis error:', err);
    });
  }
  messages: MessageDTO[] = [];
  async afterInit() {
    writeLog(chatsServiceBgColor, chatsServiceTextColor, 'CHAT WEBSOCKET INIT');

    this.server.use(async (socket, next) => {
      const token = socket.handshake.query.token as string;
      writeLog(chatsServiceBgColor, chatsServiceTextColor, 'Get TOKEN:', token);
      if (!token) {
        return next(new Error('Authentication token missing'));
      }
      try {
        const decoded = await this.auth.verifyToken(token);
        writeLog(
          chatsServiceBgColor,
          chatsServiceTextColor,
          'Token status:',
          decoded,
        );

        if (decoded) (socket as any).userId = decoded.id;
        next();
      } catch (error) {
        return next(new Error('Invalid token'));
      }
    });
  }
  async handleConnection(client: Socket & { userId: string }) {
    writeLog(
      chatsServiceBgColor,
      chatsServiceTextColor,
      'User',
      client.userId,
      'connected to chatSocket',
    );
  }
  @SubscribeMessage('joinChat')
  async handleJoinChat(
    @MessageBody() chatId: string,
    @ConnectedSocket() client: Socket & { userId: string; chatID: string },
  ) {
    writeLog(
      chatsServiceBgColor,
      chatsServiceTextColor,
      `CLIENT ID : ${client.userId}, ChatID : ${chatId}`,
    );
    const validation = await this.chatService.validateUserByChat(
      Number(client.userId),
      chatId,
    );
    if (validation) {
      client.chatID = chatId;
      client.join(chatId);
      writeLog(
        chatsServiceBgColor,
        chatsServiceTextColor,
        `User ${client.userId} connected to chat`,
        chatId,
      );

      const chatMessages = await this.chatService.getMessages(
        chatId,
        Number(client.userId),
      );
      writeLog(
        chatsServiceBgColor,
        chatsServiceTextColor,
        `sending ${chatMessages.length} messages: `,
      );

      client.emit('chatMessages', chatMessages);
    }
  }
  @SubscribeMessage('clientReadMessage')
  async handleReadMessage(
    @MessageBody() messageID: string,
    @ConnectedSocket() client: Socket & { userId: string; chatID: string },
  ) {
    writeLog(
      chatsServiceBgColor,
      chatsServiceTextColor,
      'New message read: ',
      messageID,
    );
    const readerInfo = { messageID, readerID: client.userId };
    this.server.to(client.chatID).emit('newReader', readerInfo);
    await this.queueService.addReader({
      messageID,
      chatID: client.chatID,
      userID: Number(client.userId),
    });
  }
  @SubscribeMessage('sendMessageFromClient')
  async handleSendMessage(@MessageBody() payload: CreateMessageDto) {
    writeLog(
      chatsServiceBgColor,
      chatsServiceTextColor,
      'New message received: ',
      payload.text,
    );

    const message: MessageDTO = {
      id: uuidv4(),
      createdAt: new Date(),
      authorID: payload.authorID,
      chatID: payload.chatID,
      text: payload.text,
      files: payload.files.map((file) => ({
        id: file.id,
        name: file.name,
        url: file.url,
        type: file.type,
        size: file.size,
      })),
      readers: [{ userId: payload.authorID }],
    };
    const participants = await this.chatService.getChatParticipants(
      payload.chatID,
    );

    this.server.to(message.chatID).emit('newMessage', message);

    await this.notificationGateway.sendMessageNotification(
      message,
      participants.map((participant) => participant.userId.toString()),
    );
    await this.queueService.addMessage(message);
  }
  handleDisconnect(client: Socket & { userId: string }) {
    writeLog(
      chatsServiceBgColor,
      chatsServiceTextColor,
      'User disconnected from chatSocket: UserID:',
      client.userId,
    );
  }
}
