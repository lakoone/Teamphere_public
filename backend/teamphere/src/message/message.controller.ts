import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { JwtAccessGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('api/message')
export class MessageController {
  constructor(private message: MessageService) {}
  @UseGuards(JwtAccessGuard)
  @Post()
  async getMessages(
    @Body() data: { lastLoadedMessageDate: string; chatID: string },
    @Req() req: Request & { user: { id: number } },
  ) {
    const { lastLoadedMessageDate, chatID } = data;
    const messages = await this.message.getMessages({
      take: 40,
      lastLoadedMessageDate,
      chatID,
    });

    return messages;
  }
}
