import {
  Controller,
  Post,
  UseInterceptors,
  Body,
  UseGuards,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { JwtAccessGuard } from '../auth/guards/jwt-auth.guard';
import { writeLog } from '../helpers/log';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import * as chalk from 'chalk';
import { ParseJsonPipe } from '../pipes/ParseJsonPipe';
const storageServiceBGColor = (text: string) => chalk.bgGray.black(text);
const storageServiceTextColor = (text: string) => chalk.gray(text);
@Controller('/api/storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}
  @UseGuards(JwtAccessGuard)
  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 5 }]))
  async uploadFile(
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Body('chatID') chatID: string,
    @Req() req: Request & { user: { id: number } },
    @Body('task', ParseJsonPipe) task?: { id: string; IsDescription: boolean },
  ) {
    writeLog(
      storageServiceBGColor,
      storageServiceTextColor,
      'files: ',
      files.files,
      decodeURIComponent(files.files[0].originalname),
    );
    if (!files.files) {
      throw new Error('File is not provided');
    }

    const fileResponse = [];
    for (const file of files.files) {
      file.originalname = decodeURIComponent(file.originalname);
      const res = await this.storageService.uploadFile({
        file,
        task,
        chatID: chatID ? chatID : uuidv4(),
        userID: req.user.id,
      });
      fileResponse.push(res);
    }

    writeLog(
      storageServiceBGColor,
      storageServiceTextColor,
      'file response: ',
      fileResponse,
    );

    return {
      fileResponse,
    };
  }
}
