import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { MessageDTO } from '../message/dto/message.dto';
import { Reader } from './worker/queue.processor';

@Injectable()
export class QueueService {
  constructor(@InjectQueue('messageQueue') private messageQueue: Queue) {}

  async addMessage(message: MessageDTO) {
    await this.messageQueue.add('processMessage', message, {
      removeOnComplete: true,
      removeOnFail: true,
    });
  }
  async addReader(reader: Reader) {
    await this.messageQueue.add('processReader', reader, {
      removeOnComplete: true,
      removeOnFail: true,
    });
  }
  async getMessages(batchSize: number = 50): Promise<Job[]> {
    return await this.messageQueue.getWaiting(0, batchSize - 1);
  }
}
