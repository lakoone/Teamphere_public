import { Job, Queue } from 'bullmq';
import {
  InjectQueue,
  OnWorkerEvent,
  Processor,
  WorkerHost,
} from '@nestjs/bullmq';
import { MessageDTO } from '../../message/dto/message.dto';
import { MessageService } from '../../message/message.service';
import { writeLog } from '../../helpers/log';
import * as process from 'process';

import * as chalk from 'chalk';

export type Reader = {
  messageID: string;
  chatID: string;
  userID: number;
};

const queueServiceBgColor = chalk.bgBlue.black;
const queueServiceTextColor = chalk.blue;
@Processor('messageQueue', {
  connection: {
    host: 'redis',
    port: 6379,
  },
})
export class QueueProcessor extends WorkerHost {
  private messageBuffer: MessageDTO[] = [];
  private readerBuffer: Reader[] = [];
  private lastSentTime: number = 0;
  private isProcessing = false;
  constructor(
    private readonly messageService: MessageService,
    @InjectQueue('messageQueue') private messageQueue: Queue,
  ) {
    console.log(`PROCESSOR CONSTRUCTOR PID ${process.pid}`);
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const date = new Date();
    const currentTime = Date.now();
    writeLog(
      queueServiceBgColor,
      queueServiceTextColor,
      'job name: ',
      job.name,
    );
    switch (job.name) {
      case 'processMessage':
        this.messageBuffer.push(job.data);
        break;
      case 'processReader':
        this.readerBuffer.push(job.data);
        break;
    }
    writeLog(
      queueServiceBgColor,
      queueServiceTextColor,
      `WORKER get a job [${job.id}] and paused queue at ${date.getSeconds()}.${date.getMilliseconds()}s`,
    );
    if (currentTime - this.lastSentTime > 1000 && !this.isProcessing) {
      await this.throttleProcess();
    }
  }
  private async throttleProcess() {
    this.isProcessing = true;
    await this.processBatch();
    setTimeout(async () => {
      if (this.messageBuffer.length > 0 || this.readerBuffer.length > 0) {
        writeLog(
          queueServiceBgColor,
          queueServiceTextColor,
          'buffer has message after throttleProcess',
        );
        await this.throttleProcess();
      }
      this.isProcessing = false;
    }, 1000);
  }
  private async processBatch() {
    if (this.messageBuffer.length > 0) {
      const messagesToProcess = [...this.messageBuffer];
      this.messageBuffer = [];
      this.lastSentTime = Date.now();
      console.log(`Processing batch of ${messagesToProcess.length} messages`);
      try {
        await this.messageService.CreateMessage(messagesToProcess);
      } catch (error) {
        console.error(`Batch processing failed:`, error);
      }
    }
    if (this.readerBuffer.length > 0) {
      const filterLatestReaders = (readers: Reader[]): Reader[] => {
        const latestReadersMap: Record<string, Reader> = {};

        readers.forEach((reader) => {
          const key = `${reader.userID}-${reader.chatID}`;
          latestReadersMap[key] = reader;
        });

        return Object.values(latestReadersMap);
      };
      const readersToProcess = [...this.readerBuffer];
      this.readerBuffer = [];
      const readersToUpdate = filterLatestReaders(readersToProcess);
      this.lastSentTime = Date.now();
      try {
        await this.messageService.readMessages(readersToUpdate);
      } catch (error) {
        console.error(`Batch processing failed:`, error);
      }
    }
  }
  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    console.log(`JOB [${job.id}] Completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: any) {
    console.error(`JOB [${job.id}] failed, error: ${err}`);
  }
  @OnWorkerEvent('paused')
  paused() {
    const date = new Date();
    console.log(
      `PID: ${process.pid} PAUSED EVENT at ${date.getSeconds()}.${date.getMilliseconds()}`,
    );
  }
  @OnWorkerEvent('resumed')
  resume() {
    const date = new Date();
    console.log(
      `PID: ${process.pid} RESUMED EVENT at ${date.getSeconds()}.${date.getMilliseconds()}`,
    );
  }
  @OnWorkerEvent('active')
  onActive(job: Job) {
    console.log(`JOB [${job.id}] ${job.data.text} active`);
  }
}
