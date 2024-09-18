import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { PrismaService } from '../prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  providers: [
    StorageService,
    PrismaService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
  exports: [StorageService],
})
export class StorageModule {}
