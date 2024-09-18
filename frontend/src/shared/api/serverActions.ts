'use server';
import { cookies } from 'next/headers';
import { axiosServerInstance } from '@/utils/axios-config';
import { UserType } from '@/entities/User/types';
import { friendsRequest } from '@/providers/WebSocketContext';
import { ChatMetadata } from '@/features/chats/types/ChatMetadata';
import { TaskType } from '@/entities/task/types/TaskType';

export async function getInitialData() {
  const cookie = cookies();
  try {
    const res = await axiosServerInstance.get('/api/user/initialMetadata', {
      headers: {
        Cookie: `access_token=${cookie.get('access_token')?.value}`,
      },
      timeout: 6000,
    });

    if (res.status >= 200 && res.status < 300) {
      const data: {
        userData: UserType;
        friends: UserType[];
        requests: friendsRequest[];
        unreadChats: { id: string }[];
        tasksForMe: TaskType[];
        createdTasks: TaskType[];
      } = res.data;

      return data;
    }
  } catch (e) {
    console.log('[Server Actions] Error after getting initial data :', e);
  }
}
export async function getChatsMetadata() {
  const cookie = cookies();
  try {
    const res = await axiosServerInstance.get('/api/chat/metadata', {
      headers: {
        Cookie: `access_token=${cookie.get('access_token')?.value}`,
      },
    });

    const resultData: ChatMetadata[] = res.data;

    return resultData;
  } catch (e) {
    console.log('[Server Actions] Error after getting chats metadata :', e);
  }
}
