import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { writeLog } from '../helpers/log';
import { MessageDTO } from '../message/dto/message.dto';
import { Reader } from './worker/queue.processor';
import * as chalk from 'chalk';

const queueServiceBgColor = chalk.bgBlue.black;
const queueServiceTextColor = chalk.blue;
@Injectable()
export class QueueService {
  constructor(@InjectQueue('messageQueue') private messageQueue: Queue) {}

  async addMessage(message: MessageDTO) {
    const date = new Date();
    writeLog(
      queueServiceBgColor,
      queueServiceTextColor,
      `adding message to queue at ${date.getSeconds()}.${date.getMilliseconds()}`,
    );
    await this.messageQueue.add('processMessage', message, {
      removeOnComplete: true,
      removeOnFail: true,
    });
  }
  async addReader(reader: Reader) {
    const date = new Date();
    writeLog(
      queueServiceBgColor,
      queueServiceTextColor,
      `adding reader to queue at ${date.getSeconds()}.${date.getMilliseconds()}`,
    );
    await this.messageQueue.add('processReader', reader, {
      removeOnComplete: true,
      removeOnFail: true,
    });
  }
  async getMessages(batchSize: number = 50): Promise<Job[]> {
    const waitingJobs = await this.messageQueue.getWaiting(0, batchSize - 1);
    writeLog(
      queueServiceBgColor,
      queueServiceTextColor,
      'getting messages from queue: ',
      waitingJobs,
    );
    return waitingJobs;
  }
}
