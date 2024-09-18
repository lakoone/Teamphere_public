import {
  BadRequestException,
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessGuard } from '../auth/guards/jwt-auth.guard';
import { CreateChatDTO } from './dto/create-chat.dto';
import { ChatService } from './chat.service';
import { Request } from 'express';
import { FriendService } from '../user/friend.service';
import { writeLog } from '../helpers/log';
import * as chalk from 'chalk';
import { ParseJsonPipe } from '../pipes/ParseJsonPipe';
import { MessageDTO } from '../message/dto/message.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
const chatBgColor = chalk.bgBlue.white;
const chatTextColor = chalk.blue;
@Controller('api/chat')
export class ChatController {
  constructor(
    @Inject(forwardRef(() => FriendService))
    private readonly friendService: FriendService,
    private chat: ChatService,
  ) {}
  @UseGuards(JwtAccessGuard)
  @Post()
  async createChat(
    @Body('data', ParseJsonPipe) data: CreateChatDTO,
    @Req() req: Request & { user: { id: number } },
  ) {
    writeLog(chatBgColor, chatTextColor, 'data: ', data);

    const validation = await this.friendService.isFriend(
      data.participants[0],
      req.user.id,
    );
    if (!validation)
      throw new BadRequestException('No permission for this request');
    if (data.participants.length === 2) {
      const participants = [...data.participants, req.user.id];
      const result = await this.chat.createChats([
        { name: data.name, participants },
      ]);
      if (!result) {
        throw new BadRequestException('Chat already Exist');
      }
      return result;
    } else throw new BadRequestException('Wrong quantity of participants');
  }
  @UseGuards(JwtAccessGuard)
  @Get('byFriend')
  async getChatIDByFriend(
    @Query('friendID') friendID: string,
    @Req() req: Request & { user: { id: number } },
  ) {
    writeLog(chatBgColor, chatTextColor, 'friendID:', friendID);
    return await this.chat.getChatIdByParticipants([
      Number(friendID),
      req.user.id,
    ]);
  }
  @UseGuards(JwtAccessGuard)
  @Get('metadata')
  async getChatsMetadata(@Req() req: Request & { user: { id: number } }) {
    return await this.chat.getUserChatsMetadata(req.user.id);
  }

  @UseGuards(ThrottlerGuard)
  @UseGuards(JwtAccessGuard)
  @Get('messages')
  async getMessages(
    @Req() req: Request & { user: { id: number } },
    @Query('chatID') chatID: string,
    @Query('take') take?: number,
    @Query('lastLoadedMessageDate') lastLoadedMessageDate?: string,
  ) {
    const options =
      take || lastLoadedMessageDate
        ? {
            take,
            lastLoadedMessageDate,
          }
        : null;
    writeLog(
      chatBgColor,
      chatTextColor,
      `Getting message: chatID ${chatID}, options: `,
      options,
    );
    const res: MessageDTO[] = await this.chat.getMessages(
      chatID,
      req.user.id,
      options,
    );
    return res;
  }
}
