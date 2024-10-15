import {
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
import { UserData } from '../../user/dto/user-data.dto';
import { RequestData } from '../../user/dto/send-request.dto';

import { MessageDTO } from '../../message/dto/message.dto';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { TaskDTO } from '../../task/dto/task.dto';
import * as process from 'process';
import { ChatMetadataDTO } from '../../chat/dto/chat-metadata.dto';

@WebSocketGateway({
  namespace: 'api/notification',
  cors: {
    origin: ['http://localhost:3000', `${process.env.HOST_DOMAIN}`],
    credentials: true,
  },
})
export class NotificationGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private redisClient: Redis;
  constructor(
    private readonly auth: AuthService,
    private readonly configService: ConfigService,
  ) {
    const redisHost = this.configService.get<string>('REDIS_HOST');
    const redisPort = this.configService.get<number>('REDIS_PORT');
    this.redisClient = new Redis({ host: redisHost, port: redisPort });
    this.redisClient.on('connect', () => {});

    this.redisClient.on('error', (err) => {});
  }
  private joinClientToRoom(client: Socket, userId: number) {
    client.join(userId.toString());
  }

  async afterInit() {
    this.server.use(async (socket, next) => {
      const token = socket.handshake.query.token as string;

      if (!token) {
        return next(new Error('Authentication token missing'));
      }
      try {
        const decoded = await this.auth.verifyToken(token);
        if (decoded) (socket as any).userId = decoded.id;
        next();
      } catch (error) {
        return next(new Error('Invalid token'));
      }
    });
  }
  async handleConnection(client: Socket & { userId: number }) {
    const userId = Number(client.userId);

    this.joinClientToRoom(client, userId);
  }
  async sendCreatedChats(chats: ChatMetadataDTO[]) {
    chats.forEach((chat) => {
      chat.participants.forEach((user) => {
        this.server.to(user.id.toString()).emit('newChat', chat);
      });
    });
  }
  async sendFriendRequestNotification(fromID: number, requests: RequestData[]) {
    if (requests.length > 0) {
      requests.forEach((request) => {
        this.server
          .to(request.toUserId.toString())
          .emit('newRequests', [request]);
      });
    }
  }
  async sendMessageNotification(message: MessageDTO, users: string[]) {
    users.forEach((ID) => {
      this.server.to(ID).emit('newMessageNotification', message);
    });
  }
  async sendAcceptRequestNotification(FromUser: UserData, toUsersID: number[]) {
    if (toUsersID.length > 0)
      toUsersID.forEach((user) =>
        this.server.to(user.toString()).emit('acceptRequest', FromUser),
      );
  }
  async sendDeleteFriendNotification(
    deletedFriendship: { userId: number; friendId: number }[],
  ) {
    deletedFriendship.forEach((firendship) => {
      this.server
        .to([firendship.userId.toString(), firendship.friendId.toString()])
        .emit('deletedFriendship', firendship);
    });
  }
  async sendTaskNotification(fromID: number, task: TaskDTO) {
    if (task.usersAssigned.length > 0) {
      task.usersAssigned.forEach((user) =>
        this.server.to(user.user.id.toString()).emit('newTaskCreated', task),
      );
    }
    this.server.to(task.createdByID.toString()).emit('newTaskCreated', task);
  }
  async sendTaskUpdateNotification(
    title: string,
    taskID: string,
    createdByID: number,
    usersAssigned: number[],
    data: Partial<TaskDTO>,
  ) {
    if (usersAssigned.length > 0) {
      usersAssigned.forEach((id) =>
        this.server
          .to(id.toString())
          .emit('taskUpdated', { id: taskID, title, data }),
      );
    }
    this.server
      .to(createdByID.toString())
      .emit('taskUpdated', { id: taskID, title, data });
  }
  async handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId;
    if (typeof userId === 'string') {
      client.leave(userId);
    }
  }

  @SubscribeMessage('sendNotification')
  handleNotification(
    @MessageBody() notification: { userId: string; text: string },
  ): void {
    this.server
      .to(notification.userId)
      .emit('receiveNotification', notification);
  }
}
