'use client';
import styles from './SelectChatWidget.module.scss';
import React from 'react';
import { MessageInput } from '../components/chatInput/ui/MessageInput';
import { MessageContent } from '../components/chatContent/ui/MessageContent';
import { ChatHeader } from '../components/chatHeader/ui/ChatHeader';
import { Skeleton } from '@mui/material';
import { useAppSelector } from '@/utils/hooks/reduxHook';

export const SelectChatWidget: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  const selectedChat = useAppSelector(
    (state) => state.selectedChat.selectedChat,
  );
  const splitTitle = selectedChat.name.split('|');
  const title = splitTitle.find(
    (titleElement) => titleElement !== user.profile.name,
  );
  const splitImg = selectedChat.img.split('|');
  const userIndex = splitTitle.findIndex(
    (titleElement) => titleElement !== user.profile.name,
  );
  const img = splitImg[userIndex];

  return selectedChat ? (
    <div className={styles.container}>
      <ChatHeader name={title || ''} img={img} />
      <MessageContent participants={selectedChat.chatParticipants} />
      <MessageInput />
    </div>
  ) : (
    <Skeleton variant="rectangular" width={'100%'} height={'100%'} />
  );
};
