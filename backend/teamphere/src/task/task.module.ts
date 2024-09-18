import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { StorageModule } from '../storage/storage.module';
import { NotificationSocketModule } from '../websocket/notification/NotificationSocket.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [AuthModule, StorageModule, NotificationSocketModule],
  providers: [
    TaskService,
    PrismaService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
