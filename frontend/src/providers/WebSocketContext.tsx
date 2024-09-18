'use client';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import io, { Socket } from 'socket.io-client';
import { getCookie } from '@/utils/helpers/getCookie';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/reduxHook';
import { addNewChat, newLastMessage } from '@/store/Slices/chatSlice';
import { MessageType } from '@/entities/message/types';
import { incrementIndicator } from '@/store/Slices/indicatorSlice';

import {
  addTaskCreatedByMe,
  addTaskForMe,
  updateTaskForMe,
} from '@/store/Slices/taskSlice';
import { TaskType, TaskUpdatedDTO } from '@/entities/task/types/TaskType';
import { axiosInstance } from '@/utils/axios-config';
import { addRequests } from '@/store/Slices/requestSlice';
import { useSnackbar } from '@/providers/SnackbarContext';
import { useTranslations } from 'next-intl';
import { addFriends, removeFriend } from '@/store/Slices/friendSlice';
import { UserType } from '@/entities/User';
import { ChatMetadata } from '@/features/chats/types/ChatMetadata';
const SOCKET_URL = `${process.env.NEXT_PUBLIC_STATUS === 'prod' ? process.env.NEXT_PUBLIC_DOMAIN : 'http://localhost:5000'}/api/notification`;

export type friendsRequest = {
  id: number;
  fromUserId: number;
  toUserId: number;
  status: 'pending' | 'accepted' | 'rejected';
};

export type AcceptedRequest = { id: number; name: string; img: string };

interface WebSocketContextProps {
  socket: Socket | null;
}
interface WebSocketProviderProps {
  children: ReactNode;
}
const WebSocketContext = createContext<WebSocketContextProps | null>(null);
export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const tTask = useTranslations('Task');
  const tProcessing = useTranslations('ProcessingData');
  const tFriends = useTranslations('FriendsPage');
  const user = useAppSelector((state) => state.user);
  const [socket, setSocket] = useState<Socket | null>(null);
  const { showSnackbar } = useSnackbar();
  const connectSocket = (token: string) => {
    const socketIO = io(SOCKET_URL, {
      query: {
        token,
      },
      withCredentials: true,
      transports: ['websocket'],
    });

    socketIO.on('connect_error', async (error) => {
      console.error('Connection error:', error.message === 'Invalid token');

      if (error.message === 'Invalid token') {
        try {
          axiosInstance.post('api/auth/refresh', {}, { withCredentials: true });

          const newToken = getCookie('access_token');

          if (newToken) {
            connectSocket(newToken);
          }
        } catch (refreshError) {
          console.error('Failed to refresh token:', refreshError);
          window.location.href = '/login';
        }
      }
    });

    socketIO.on('acceptRequest', (acceptedRequestsByUser: UserType) => {
      dispatch(addFriends([acceptedRequestsByUser]));
      showSnackbar(
        `${acceptedRequestsByUser.profile.name} ${tFriends('AcceptedYourRequest')}`,
      );
    });
    socketIO.on('newChat', (chat: ChatMetadata) => {
      const filteredParticipants = chat.participants.filter(
        (participant) => participant.id !== user.id,
      );
      dispatch(addNewChat({ ...chat, participants: filteredParticipants }));
    });
    socketIO.on('newRequests', (request: friendsRequest[]) => {
      dispatch(addRequests(request));
      dispatch(incrementIndicator({ type: 'request' }));
    });
    socketIO.on(
      'deletedFriendship',
      (friendship: { userId: number; friendId: number }) => {
        const friendID =
          friendship.friendId !== user.id
            ? friendship.friendId
            : friendship.userId;
        dispatch(removeFriend(friendID));
      },
    );
    socketIO.on('newMessageNotification', (message: MessageType) => {
      const isAuthor = message.authorID === user.id;
      dispatch(newLastMessage({ lastMessage: message, isAuthor }));
      if (!isAuthor)
        dispatch(
          incrementIndicator({ type: 'message', chatID: message.chatID }),
        );
    });

    socketIO.on('newTaskCreated', (task: TaskType) => {
      if (task.createdByID === user.id) {
        dispatch(addTaskCreatedByMe([task]));
      } else {
        dispatch(addTaskForMe([task]));
        showSnackbar(`${tTask('NewTaskReceived')} "${task.title}" `, 'info');
      }
    });
    socketIO.on('taskUpdated', (updatedTask: TaskUpdatedDTO) => {
      dispatch(updateTaskForMe(updatedTask));
      if (updatedTask.data.changedByID !== user.id)
        showSnackbar(
          `${tTask('TaskTitle')} "${updatedTask.title}" ${tProcessing('Modified')}`,
          'info',
        );
    });

    setSocket(socketIO);

    return socketIO;
  };
  useEffect(() => {
    if (user) {
      const token = getCookie('access_token');

      if (token) {
        const socketIO = connectSocket(token);

        return () => {
          socketIO.disconnect();
        };
      } else {
        window.location.href = '/login';
      }
    }
  }, [user]);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
