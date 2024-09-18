import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { MessageService } from './message.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [AuthModule],
  providers: [
    PrismaService,
    StorageService,
    MessageService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
  exports: [MessageService],
})
export class MessageModule {}
