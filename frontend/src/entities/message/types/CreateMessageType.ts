import { fileDTO } from '@/entities/file/types';

export type CreateMessageType = {
  authorID: number;
  text: string;
  chatID?: string | number;
  files: fileDTO[];
};
