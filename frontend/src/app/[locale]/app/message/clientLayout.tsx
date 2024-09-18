'use client';
import { ReactNode, useEffect, useState } from 'react';
import styles from './message.module.scss';
import { ChatsWidget } from '@/features/chats/components/chatList/ui/ChatsWidget';
import { ChatSocketProvider } from '@/features/chats/context/ChatSocketContext';
import { ChatMetadata } from '@/features/chats/types/ChatMetadata';
import { useAppDispatch } from '@/utils/hooks/reduxHook';
import { setChatMetadata } from '@/store/Slices/chatSlice';
import { Loader } from '@/shared/components/Loader';
import { ChatOpenProvider } from '@/features/chats/context/ChatOpenContext';

export default function MessageClientLayout({
  children,
  chatsMetadata,
}: {
  children: ReactNode;
  chatsMetadata: ChatMetadata[];
}) {
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setChatMetadata(chatsMetadata));
    setLoading(false);
  }, [chatsMetadata]);

  return loading ? (
    <Loader />
  ) : (
    <div className={styles.container}>
      <ChatOpenProvider>
        <ChatsWidget />
        <ChatSocketProvider>{children}</ChatSocketProvider>
      </ChatOpenProvider>
    </div>
  );
}
