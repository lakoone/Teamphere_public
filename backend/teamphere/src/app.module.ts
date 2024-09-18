import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
import { AuthController } from './auth/auth.controller';
import { TaskModule } from './task/task.module';
import { StorageModule } from './storage/storage.module';
import { StorageController } from './storage/storage.controller';
import { MessageModule } from './message/message.module';
import { MessageController } from './message/message.controller';
import { ChatController } from './chat/chat.controller';
import { ChatModule } from './chat/chat.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ChatSocketModule } from './websocket/message/chatSocket.module';
import { NotificationSocketModule } from './websocket/notification/NotificationSocket.module';
import { BullModule } from '@nestjs/bullmq';
import { QueueModule } from './queue/queue.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { ThrottlerModule } from '@nestjs/throttler';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 200,
      },
    ]),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    AuthModule,
    TaskModule,
    UserModule,
    StorageModule,
    MessageModule,
    QueueModule,
    ChatSocketModule,
    NotificationSocketModule,
    ChatModule,
    EventEmitterModule.forRoot(),
  ],

  controllers: [
    AppController,
    UserController,
    AuthController,
    StorageController,
    MessageController,
    ChatController,
  ],
  providers: [AppService, PrismaService],
})
export class AppModule {}
