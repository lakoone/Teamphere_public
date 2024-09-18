import { fileDTO } from '@/entities/file/types';

export type MessageType = {
  id: string;
  createdAt: string;
  authorID: number;
  chatID: string;
  text: string;
  readers: number[];
  files: fileDTO[];
};

export type MessageDTO = {
  id: string;
  createdAt: string;
  authorID: number;
  chatID: string;
  text: string;
  readers: { userId: number }[];
  files: fileDTO[];
};

export type InitMessageDTO = {
  authorID: number;
  text: string;
  chatID: string | number;
  files: fileDTO[];
};
