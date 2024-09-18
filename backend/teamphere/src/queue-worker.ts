import { NestFactory } from '@nestjs/core';
import { Worker } from 'bullmq';
import { QueueProcessor } from './queue/worker/queue.processor';
import { WorkerModule } from './queue/worker/worker.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(WorkerModule);
  const configService = appContext.get(ConfigService);
  const redisHost = configService.get<string>('REDIS_HOST');
  const redisPort = configService.get<number>('REDIS_PORT');
  console.log(`FROM WORKER.TS ${redisHost} : ${redisPort}`);

  const worker = new Worker(
    'messageQueue',
    async (job) => {
      const processor = appContext.get(QueueProcessor);
      await processor.process(job);
    },
    {
      connection: {
        host: redisHost,
        port: redisPort,
      },
      lockDuration: 30000,
    },
  );

  worker.on('completed', (job) => {
    console.log(`Job with id ${job.id} has been completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Job with id ${job.id} has failed with ${err.message}`);
  });

  console.log('Worker is running...');
}

bootstrap();
