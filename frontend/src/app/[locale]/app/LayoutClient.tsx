'use client';
import React, { ReactNode } from 'react';
import { UserType } from '@/entities/User/types';
import {
  friendsRequest,
  WebSocketProvider,
} from '@/providers/WebSocketContext';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import InitialLayout from '@/app/[locale]/app/initialLayout';
import { TaskType } from '@/entities/task/types/TaskType';
import { SnackbarProvider } from '@/providers/SnackbarContext';
const LayoutClient = ({
  children,
  user,
  friends,
  requests,
  unreadChats,
  createdTasks,
  taskForMe,
}: {
  children: ReactNode;
  user: UserType;
  unreadChats: { id: string }[];
  friends: UserType[];
  requests: friendsRequest[];
  createdTasks: TaskType[];
  taskForMe: TaskType[];
}) => {
  return (
    <Provider store={store}>
      <SnackbarProvider>
        <WebSocketProvider>
          <InitialLayout
            initialData={{
              friends,
              user,
              requests,
              unreadChats,
              taskForMe,
              createdTasks,
            }}
          >
            {children}
          </InitialLayout>
        </WebSocketProvider>
      </SnackbarProvider>
    </Provider>
  );
};
export default React.memo(LayoutClient);
