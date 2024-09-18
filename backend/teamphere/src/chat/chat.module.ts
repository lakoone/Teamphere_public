import { forwardRef, Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { AuthModule } from '../auth/auth.module';
import { ChatService } from './chat.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { UserModule } from '../user/user.module';
import { MessageModule } from '../message/message.module';
import { StorageModule } from '../storage/storage.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    AuthModule,
    forwardRef(() => UserModule),
    MessageModule,
    StorageModule,
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    PrismaService,
    StorageService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
  exports: [ChatService],
})
export class ChatModule {}
