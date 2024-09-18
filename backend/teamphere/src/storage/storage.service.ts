import { Injectable } from '@nestjs/common';
import { firebaseAdmin } from '../../firebase-admin.config';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import * as chalk from 'chalk';
import { writeLog } from '../helpers/log';

const storageServiceBgColor = chalk.bgGray.black;
const storageServiceTextColor = chalk.gray;
@Injectable()
export class StorageService {
  constructor(private prisma: PrismaService) {}
  private bucket = firebaseAdmin.storage().bucket();

  async uploadFile(props: {
    file: Express.Multer.File;
    userID: number;
    chatID?: string;
    task?: { id: string; IsDescription: boolean };
  }): Promise<{
    url: string;
    id: string;
    size: number;
    name: string;
    type: string;
  }> {
    writeLog(
      storageServiceBgColor,
      storageServiceTextColor,
      `uploading file : `,
      props.file.originalname,
    );

    if (!props.userID && !props.chatID) {
      throw Error('Bad destination way');
    }
    const id = uuidv4();
    const destination = props.chatID
      ? `chats/${props.chatID}/${props.task ? `task/${props.task.id}/${props.task.IsDescription ? 'Description' : 'Answer'}/` : ''}${id + '_' + props.file.originalname}`
      : `users/${props.userID}/${id + '_' + props.file.originalname}`;
    const file = this.bucket.file(destination);

    await file.save(props.file.buffer, {
      metadata: { contentType: 'auto' },
    });

    const [url] = await file.getSignedUrl({
      host: undefined,
      signingEndpoint: undefined,
      action: 'read',
      expires: '03-09-2491',
    });

    const fileData: any = {
      id: id,
      url: url,
      name: props.file.originalname,
      size: props.file.size,
      type: props.file.mimetype,
    };
    writeLog(
      storageServiceBgColor,
      storageServiceTextColor,
      `file data to create:`,
      fileData,
    );

    console.log(fileData);
    await this.prisma.file.create({ data: fileData });

    return {
      url: url,
      id: id,
      name: props.file.originalname,
      size: props.file.size,
      type: props.file.mimetype,
    };
  }
  async deleteFile(destination: string): Promise<void> {
    const file = this.bucket.file(destination);
    await file.delete();
    writeLog(
      storageServiceBgColor,
      storageServiceTextColor,
      `deleted file :`,
      destination,
    );
  }
  async getFileUrl(destination: string): Promise<string> {
    writeLog(
      storageServiceBgColor,
      storageServiceTextColor,
      `get file URL :`,
      destination,
    );
    const file = this.bucket.file(destination);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491',
    });

    return url;
  }
}
