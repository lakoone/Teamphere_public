import styles from './ChatHeader.module.scss';
import { IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Header } from '@/shared/components/Header';
import React from 'react';
import { UserType } from '@/entities/User/types';
import { UserAvatar } from '@/entities/User/components/UserAvatar/UserAvatar';
import ArrowRightIcon from '@/shared/icons/ArrowRightIcon';
import { useChatOpen } from '@/features/chats/context/ChatOpenContext';
import TaskIcon from '@/shared/icons/TaskIcon';

interface ChatHeaderProps {
  img: string;
  name: string;
  participants?: UserType[];
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  img,
  name,
  participants,
}) => {
  const { toggleChatList, toggleTaskWidget } = useChatOpen();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Header style={{ backgroundColor: 'var(--bg-color2)' }} height={'100px'}>
      {isSmallScreen && (
        <IconButton onClick={() => toggleChatList()}>
          <ArrowRightIcon />
        </IconButton>
      )}
      <UserAvatar name={name} size={'medium'} img={img} />
      <div className={styles.HeadContent}>
        <h3>{name}</h3>
      </div>
      {isSmallScreen && (
        <IconButton
          sx={{ marginLeft: 'auto' }}
          onClick={() => toggleTaskWidget()}
        >
          <TaskIcon />
        </IconButton>
      )}
    </Header>
  );
};
