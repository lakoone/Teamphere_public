import { Module } from '@nestjs/common';
import { QueueService } from './message-queue.service';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessageModule } from '../message/message.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.registerQueueAsync({
      name: 'messageQueue',
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullBoardModule.forFeature({
      name: 'messageQueue',
      adapter: BullMQAdapter,
    }),
    MessageModule,
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
