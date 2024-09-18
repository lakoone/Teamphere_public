import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import * as cookieParser from 'cookie-parser';
import config from '../firebase-admin.config';
import { initializeApp } from 'firebase/app';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisIoAdapter } from './redis-io.adapter';

async function start() {
  console.log('START');
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const redisHost = configService.get<string>('REDIS_HOST');
  const redisPort = configService.get<number>('REDIS_PORT');
  const pubClient = new Redis({ host: redisHost, port: redisPort });
  const subClient = pubClient.duplicate();
  pubClient.on('connect', () => {
    console.log('Connected to Redis pubClient');
  });

  subClient.on('connect', () => {
    console.log('Connected to Redis subClient');
  });

  pubClient.on('error', (err) => {
    console.error('Redis pubClient error:', err);
  });

  subClient.on('error', (err) => {
    console.error('Redis subClient error:', err);
  });
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  initializeApp(config);
  app.use(cookieParser());
  app.enableCors({
    origin: [
      `${configService.get<string>('HOST_DOMAIN')}`,
      'http://localhost:3000',
    ],
    credentials: true,
  });

  await app.listen(PORT, () => console.log(`ALL IS OK PORT : ${PORT}`));
}
start();
