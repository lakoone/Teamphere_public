import { forwardRef, Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { FriendService } from './friend.service';
import { FriendRequestService } from './friend-request.service';
import { NotificationSocketModule } from '../websocket/notification/NotificationSocket.module';
import { ChatModule } from '../chat/chat.module';
import { TaskModule } from '../task/task.module';
import { StorageModule } from '../storage/storage.module';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    TaskModule,
    NotificationSocketModule,
    StorageModule,
    AuthModule,
    forwardRef(() => ChatModule),
  ],
  providers: [
    UserService,
    PrismaService,
    FriendService,
    FriendRequestService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
  exports: [UserService, FriendService, FriendRequestService],
})
export class UserModule {}
