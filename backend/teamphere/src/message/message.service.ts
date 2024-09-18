import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { MessageDTO } from './dto/message.dto';
import { writeLog } from '../helpers/log';

import * as chalk from 'chalk';

const messageServiceBgColor = chalk.bgYellow.black;
const messageServiceTextColor = chalk.yellow;
@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async CreateMessage(data: MessageDTO[]) {
    try {
      const date = new Date();
      writeLog(
        messageServiceBgColor,
        messageServiceTextColor,
        `adding message to DB at ${date.getSeconds()}.${date.getMilliseconds()} s`,
      );
      return await this.prisma.$transaction(async (tx) => {
        const dataToCreate = data.map(({ files, readers, ...rest }) => ({
          files,
          readers,
          message: { ...rest },
        }));

        const createdMessages = await tx.message.createMany({
          data: dataToCreate.map((data) => data.message),
        });

        const fileMessagePairs: { fileId: string; messageId: string }[] = [];
        dataToCreate.forEach((data) => {
          data.files.forEach((file) => {
            fileMessagePairs.push({
              fileId: file.id,
              messageId: data.message.id,
            });
          });
        });

        console.log('FileMessage Pairs:', fileMessagePairs);

        if (fileMessagePairs.length > 0) {
          await tx.messageFile.createMany({
            data: fileMessagePairs,
          });
        }
        const readersToCreate = dataToCreate.map((data) => ({
          messageId: data.message.id,
          userId: data.message.authorID,
        }));
        console.log('readers to create:', readersToCreate);
        await tx.reader.createMany({
          data: readersToCreate,
        });

        return createdMessages;
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.error('Prisma error:', error.message);
      } else {
        console.error('Error creating message:', error);
      }
      throw error;
    }
  }

  async getMessages({
    take,
    lastLoadedMessageDate,
    chatID,
  }: {
    take?: number;
    lastLoadedMessageDate?: string;
    chatID: string;
  }) {
    const takeOption = take || 35;
    const whereClause = lastLoadedMessageDate
      ? {
          chatID,
          createdAt: {
            lt: new Date(lastLoadedMessageDate),
          },
        }
      : { chatID: chatID };
    writeLog(
      messageServiceBgColor,
      messageServiceTextColor,
      'lastLoadedMessageDate : ',
      lastLoadedMessageDate,
    );
    const messages = await this.prisma.message.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        readers: { select: { userId: true } },
        files: {
          select: {
            file: {
              select: {
                id: true,
                name: true,
                url: true,
                type: true,
                size: true,
              },
            },
          },
        },
      },
      take: Number(takeOption),
    });
    const transformedMessages = messages.map((message) => ({
      id: message.id,
      createdAt: message.createdAt,
      authorID: message.authorID,
      chatID: message.chatID,
      text: message.text,
      readers: message.readers.map((reader) => ({
        userId: reader.userId,
      })),
      files: message.files.map((file) => ({
        id: file.file.id,
        name: file.file.name,
        url: file.file.url,
        type: file.file.type,
        size: file.file.size,
      })),
    }));

    return transformedMessages;
  }

  async readMessages(
    readers: { messageID: string; userID: number; chatID: string }[],
  ) {
    writeLog(
      messageServiceBgColor,
      messageServiceTextColor,
      'Prepare data :',
      readers,
    );
    const lastReadMessages = await this.prisma.message.findMany({
      where: {
        id: {
          in: readers.map((reader) => reader.messageID),
        },
      },
      select: {
        id: true,
        createdAt: true,
        chatID: true,
      },
    });
    const lastReadMessagesMap = new Map<
      string,
      { reader: number; createdAt: Date; chatID: string }
    >();
    readers.forEach((reader) => {
      const message = lastReadMessages.find(
        (message) => message.id === reader.messageID,
      );
      if (message)
        lastReadMessagesMap.set(reader.messageID, {
          createdAt: message.createdAt,
          reader: reader.userID,
          chatID: message.chatID,
        });
    });

    for (const reader of lastReadMessagesMap) {
      const unreadMessages = await this.prisma.message.findMany({
        where: {
          chatID: reader[1].chatID,
          createdAt: {
            lte: reader[1].createdAt,
          },
          readers: {
            none: {
              userId: reader[1].reader,
            },
          },
        },
        select: {
          id: true,
          text: true,
        },
      });
      writeLog(
        messageServiceBgColor,
        messageServiceTextColor,
        'Unread MESSAGES:',
        unreadMessages,
      );
      const readerEntries = unreadMessages.map((message) => ({
        messageId: message.id,
        userId: reader[1].reader,
      }));
      if (readerEntries.length > 0) {
        await this.prisma.reader.createMany({
          data: readerEntries,
          skipDuplicates: true,
        });
      }
    }

    writeLog(
      messageServiceBgColor,
      messageServiceTextColor,
      'Messages marked as read',
    );
  }
}
