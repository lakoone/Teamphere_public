import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChatDTO } from './dto/create-chat.dto';
import { v4 as uuidv4 } from 'uuid';
import { AddParticipantsDTO } from './dto/add-participants.dto';
import { MessageService } from '../message/message.service';
import { ChatMetadataDTO } from './dto/chat-metadata.dto';
import { UserDataDTO } from '../user/dto/user-data.dto';
import { Prisma, PrismaClient } from '@prisma/client';

import * as chalk from 'chalk';
import { writeLog } from '../helpers/log';
import { DefaultArgs } from '@prisma/client/runtime/library';

const chatServiceBgColor = chalk.bgBlue.white;
const chatServiceTextColor = chalk.blue;
const chatServiceColor = (text: string) => chalk.bgBlue.white(text);
@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private message: MessageService,
  ) {}
  async getChatMetadata(chatID: string) {
    const chatMetadata = await this.prisma.chat.findUnique({
      where: { id: chatID },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            files: {
              include: {
                file: {
                  select: {
                    url: true,
                    name: true,
                    type: true,
                    size: true,
                  },
                },
              },
            },
            readers: { select: { userId: true } },
          },
        },
        chatParticipants: {
          select: { user: { select: { id: true, profile: true } } },
        },
        tasks: true,
      },
    });
    return chatMetadata;
  }
  async isChatExist(participantIDs: number[]) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        AND: [
          {
            chatParticipants: {
              every: {
                userId: { in: participantIDs },
              },
            },
          },
          {
            chatParticipants: {
              none: {
                userId: { notIn: participantIDs },
              },
            },
          },
        ],
      },
    });
    writeLog(chatServiceBgColor, chatServiceTextColor, 'found chats: ', chat);
    return chat;
  }
  async createChats(data: CreateChatDTO[]) {
    try {
      const createdChatsData: ChatMetadataDTO[] = [];
      writeLog(chatServiceBgColor, chatServiceTextColor, 'params: ', data);
      for (const createChatData of data) {
        const participantIDs = Array.from(
          new Set<number>([...createChatData.participants]),
        );
        writeLog(
          chatServiceBgColor,
          chatServiceTextColor,
          'participantIDs:',
          participantIDs,
        );
        const id = uuidv4();
        const isChatExist = await this.isChatExist(participantIDs);
        writeLog(
          chatServiceBgColor,
          chatServiceTextColor,
          'chat exist: ',
          isChatExist,
        );
        if (isChatExist) {
          continue;
        }
        const participants = await this.prisma.user.findMany({
          where: { id: { in: participantIDs } },
          include: { profile: true },
        });
        if (!participants.length) {
          throw new BadRequestException('participants not found');
        }
        const chatName = createChatData.name
          ? createChatData.name
          : participants
              .map((participant) => participant.profile.name)
              .join('|');
        const chatImage = participants
          .map((participant) => participant.profile.img)
          .join('|');
        await this.prisma.$transaction(async (tx) => {
          console.log(
            chatServiceColor('[chat.service - createChat] Generated ID: ') + id,
          );

          const chat = await tx.chat.create({
            data: {
              id: id,
              name: chatName,
              img: chatImage,
              isGroup: createChatData.participants.length > 2,
            },
          });

          console.log(
            chatServiceColor('[chat.service - createChat]') +
              chalk.blue(' Chat created successfully'),
          );
          await this.addParticipants(
            {
              chatId: id,
              userIds: createChatData.participants,
            },
            tx,
          );
          console.log(
            chatServiceColor('[chat.service - createChat]') +
              chalk.blue(' Participants added successfully'),
          );
          createdChatsData.push({
            id: chat.id,
            img: chat.img,
            title: chat.name,
            isGroup: chat.isGroup,
            lastMessage: null,
            unreadMessages: 0,
            participants: participants,
          });
        });
      }
      return createdChatsData;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Prisma error:', error.message);
      } else {
        console.error('Error creating chat:', error);
      }
      throw error;
    }
  }

  async addParticipants(
    data: AddParticipantsDTO,
    tx?: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
  ): Promise<void> {
    writeLog(chatServiceBgColor, chatServiceTextColor, 'data: ', data);
    const prisma = tx ? tx : this.prisma;
    const { chatId, userIds } = data;
    const chatParticipants = userIds.map((userId) => {
      const a = prisma.user.findUnique({ where: { id: userId } });
      if (!a) throw Error('User not found');
      return {
        chatId,
        userId,
      };
    });

    await prisma.chatParticipant.createMany({
      data: chatParticipants,
    });
    writeLog(
      chatServiceBgColor,
      chatServiceTextColor,
      'Participants added successfully ',
    );
  }
  async getUserChatsMetadata(userId: number): Promise<ChatMetadataDTO[]> {
    writeLog(chatServiceBgColor, chatServiceTextColor, 'userId :', userId);
    const chats = await this.prisma.chatParticipant.findMany({
      where: { userId },
      include: {
        chat: {
          include: {
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: {
                files: {
                  include: {
                    file: {
                      select: {
                        name: true,
                        type: true,
                        size: true,
                      },
                    },
                  },
                },
                readers: { select: { userId: true } },
              },
            },
            chatParticipants: {
              select: { user: { select: { id: true, profile: true } } },
            },
            _count: {
              select: {
                messages: {
                  where: {
                    AND: [
                      {
                        NOT: {
                          readers: {
                            some: {
                              userId: userId,
                            },
                          },
                        },
                      },
                      {
                        NOT: {
                          authorID: userId,
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      },
    });
    const chatMetadata: ChatMetadataDTO[] = chats.map((participant) => {
      const chat = participant.chat;
      const lastMessage = chat.messages[0] || null;
      const chatParticipants: UserDataDTO[] = chat.chatParticipants
        .filter((participant) => participant.user.id !== userId)
        .map((el) => {
          return { ...el.user };
        });
      console.log(
        `Chat participants for user id: ${userId} :`,
        chatParticipants,
      );

      return {
        id: chat.id,
        img: chat.img,
        title: chat.name,
        isGroup: chat.isGroup,
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              createdAt: lastMessage.createdAt,
              authorID: lastMessage.authorID,
              chatID: lastMessage.chatID,
              text: lastMessage.text,
              files: lastMessage.files.map((file) => ({
                name: file.file.name,
                type: file.file.type,
                size: file.file.size,
              })),
            }
          : null,
        unreadMessages: participant.chat._count.messages,
        participants: chatParticipants,
      } as ChatMetadataDTO;
    });
    writeLog(
      chatServiceBgColor,
      chatServiceTextColor,
      `Chat metadata for userID ${userId} :`,
      chatMetadata,
    );
    return chatMetadata;
  }
  async getUnreadChatsIDs(userId: number) {
    const chatIDs = await this.prisma.chat.findMany({
      where: {
        chatParticipants: {
          some: {
            userId: userId,
          },
        },
        messages: {
          some: {
            AND: [
              {
                readers: {
                  none: {
                    userId: userId,
                  },
                },
              },
              {
                authorID: {
                  not: userId,
                },
              },
            ],
          },
        },
      },
      select: { id: true },
    });
    return chatIDs;
  }
  async getChatParticipants(chatID: string) {
    const participants = await this.prisma.chatParticipant.findMany({
      where: { chatId: chatID },
      select: { userId: true },
    });
    return participants;
  }
  async getMessages(
    chatId: string,
    userID: number,
    options?: { take?: number; lastLoadedMessageDate?: string },
  ) {
    const validation = await this.validateUserByChat(userID, chatId);
    writeLog(chatServiceBgColor, chatServiceTextColor, 'chatId :', chatId);

    if (validation) {
      const messages = await this.message.getMessages({
        chatID: chatId,
        take: options?.take,
        lastLoadedMessageDate: options?.lastLoadedMessageDate,
      });
      writeLog(
        chatServiceBgColor,
        chatServiceTextColor,
        'got messages :',
        messages.length,
      );
      return messages;
    }
    throw new UnauthorizedException('no access to chat messages');
  }
  async validateUserByChat(userID: number, chatID: string) {
    const result = await this.prisma.chatParticipant.findUnique({
      where: {
        chatId_userId: {
          chatId: chatID,
          userId: userID,
        },
      },
    });
    return !!result;
  }
  async getChatIdByParticipants(IDs: number[]) {
    const res = await this.isChatExist(IDs);
    return res.id;
  }
}
