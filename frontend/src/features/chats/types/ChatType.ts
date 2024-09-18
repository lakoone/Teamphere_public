import { MessageType } from '@/entities/message/types';
import { UserType } from '@/entities/User/types';
import { TaskType } from '@/entities/task/types/TaskType';

export type ChatType = {
  id: string;
  img: string;
  name: string;
  tasks: TaskType[];
  isGroup: boolean;
  messages: MessageType[];
  chatParticipants: UserType[];
};
