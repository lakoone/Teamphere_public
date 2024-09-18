import { MessageType } from '@/entities/message/types';
import { UserType } from '@/entities/User/types';

export type ChatMetadata = {
  id: string;
  img: string;
  title: string;
  isGroup: boolean;
  lastMessage?: MessageType;
  unreadMessages: number;
  participants: UserType[];
};
