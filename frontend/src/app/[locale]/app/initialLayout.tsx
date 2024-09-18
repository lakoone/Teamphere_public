'use client';
import styles from './AppLayout.module.scss';
import { Navbar } from '@/Widgets/Navbar';
import React, { ReactNode, useEffect, useState } from 'react';
import { UserType } from '@/entities/User/types';
import { friendsRequest } from '@/providers/WebSocketContext';
import { useAppDispatch } from '@/utils/hooks/reduxHook';
import { setUser } from '@/store/Slices/userSlice';
import { setFriends } from '@/store/Slices/friendSlice';
import { setRequests } from '@/store/Slices/requestSlice';
import { setIndicators } from '@/store/Slices/indicatorSlice';
import { Loader } from '@/shared/components/Loader';
import { TaskType } from '@/entities/task/types/TaskType';
import { setTaskCreatedByMe, setTaskForMe } from '@/store/Slices/taskSlice';
type initialData = {
  user: UserType;
  unreadChats: { id: string }[];
  friends: UserType[];
  requests: friendsRequest[];
  createdTasks: TaskType[];
  taskForMe: TaskType[];
};
const InitialLayout = ({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: initialData;
}) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setUser(initialData.user));
    dispatch(setFriends(initialData.friends));
    dispatch(setRequests(initialData.requests));
    dispatch(
      setIndicators({
        messageNumber: initialData.unreadChats.length,
        requestNumber: initialData.requests.length,
        taskNumber: 0,
        chatsWithNewMessages: initialData.unreadChats.map((chats) => chats.id),
      }),
    );
    dispatch(setTaskCreatedByMe(initialData.createdTasks));
    dispatch(setTaskForMe(initialData.taskForMe));
    setLoading(false);
  }, [initialData, dispatch]);

  return loading ? (
    <Loader />
  ) : (
    <div className={styles.container}>
      <Navbar />
      <section className={styles.content}>{children}</section>
    </div>
  );
};
export default React.memo(InitialLayout);
