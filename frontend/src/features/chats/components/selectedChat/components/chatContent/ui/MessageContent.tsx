'use client';
import styles from './MessageContent.module.scss';
import { MessageBlock } from '../components/messageBlock/ui/MessageBlock';
import {
  Avatar,
  AvatarGroup,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { UserType } from '@/entities/User/types';
import { Colors } from '@/styles/colors/colors';
import { throttle } from '@/utils/helpers/throttle';
import { Time } from '@/shared/components/Time';
import { Loader } from '@/shared/components/Loader';
import { useAppSelector } from '@/utils/hooks/reduxHook';
import ArrowRightIcon from '@/shared/icons/ArrowRightIcon';

import { stringToColor } from '@/utils/helpers/stringToColor';
import { ConvertNameForImg } from '@/utils/helpers/convertNameForImg';
import { useChatMessages } from '@/features/chats/components/selectedChat/components/chatContent/hooks/useChatMessages';
import { useTranslations } from 'next-intl';

interface MessageProps {
  participants: UserType[];
}

export const MessageContent: React.FC<MessageProps> = ({ participants }) => {
  const selectedChat = useAppSelector(
    (state) => state.selectedChat.selectedChat,
  );
  const messages = useAppSelector(
    (state) => state.selectedChat.selectedChat.messages,
  );
  const messagesRef = useRef(messages);
  const [isScrollAvailable, setIsScrollAvailable] = useState(false);
  const user = useAppSelector((state) => state.user);
  const chatRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('MessagePage');
  const { handleScroll, isAtBottom, isLoading, showScrollBtn, markAsRead } =
    useChatMessages(selectedChat.id, chatRef);

  useEffect(() => {
    const chat = chatRef.current;
    if (chat && isAtBottom) {
      chat.scrollTop = chat.scrollHeight;
    }
  }, [messages, isAtBottom]);

  const debouncedHandleScroll = throttle(handleScroll, 400);
  useEffect(() => {
    messagesRef.current = messages;
    const checkScroll = () => {
      if (chatRef.current) {
        const hasScroll =
          chatRef.current.scrollHeight > chatRef.current.clientHeight;
        setIsScrollAvailable(hasScroll);
      }
    };

    if (messages) {
      checkScroll();
    }
    window.addEventListener('resize', checkScroll);

    return () => window.removeEventListener('resize', checkScroll);
  }, [messages]);

  useEffect(() => {
    const chat = chatRef.current;
    if (!chat) return;
    const observer = new IntersectionObserver(markAsRead, {
      root: chat,
      rootMargin: '0px',
      threshold: 0.01,
    });
    const messageElements = chat.querySelectorAll('[data-message]');
    messageElements.forEach((el) => observer.observe(el));

    return () => {
      messageElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [messages, markAsRead]);
  useEffect(() => {
    const chat = chatRef.current;
    if (chat) {
      chat.addEventListener('scroll', debouncedHandleScroll);
      return () => chat.removeEventListener('scroll', debouncedHandleScroll);
    }
  }, [messages, debouncedHandleScroll]);

  return (
    <section className={styles.content}>
      {showScrollBtn && (
        <IconButton
          sx={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            zIndex: 300,
            ':first-child': {
              transform: 'rotate(90deg)',
            },
          }}
          onClick={() =>
            chatRef.current?.scrollTo({
              top: chatRef.current.scrollHeight,
              behavior: 'smooth',
            })
          }
        >
          <ArrowRightIcon />
        </IconButton>
      )}

      <div className={styles.scroll} ref={chatRef}>
        {isLoading ? (
          <div className={styles.messageLoader}>
            <Loader local={true} />
          </div>
        ) : isScrollAvailable ? (
          <Typography sx={{ margin: 'auto' }} color={Colors.SURFACE}>
            {t('ReachedTheEnd')}
          </Typography>
        ) : null}
        {!messages.length && (
          <Typography
            color={Colors.SURFACE}
            sx={{ margin: 'auto', marginTop: 'auto' }}
          >
            {t('FirstMessage')}
          </Typography>
        )}
        {messages.length > 0 && (
          <>
            <div className={styles.messages}>
              {messages.map((message, index) => {
                const nextMessage = messages[index + 1];
                const isDifferentDay =
                  !nextMessage ||
                  new Date(message.createdAt).toDateString() !==
                    new Date(nextMessage.createdAt).toDateString();
                const zIndex = messages.length - index;
                return (
                  <React.Fragment key={message.id}>
                    <MessageBlock
                      files={message.files}
                      readers={message.readers}
                      id={message.id}
                      ownerPerspective={user.id === message.authorID}
                      from={
                        message.authorID === user.id
                          ? user
                          : participants.find(
                              (user) => user.id === message.authorID,
                            )!
                      }
                      text={message.text}
                      time={message.createdAt}
                    />
                    {isDifferentDay && (
                      <div
                        key={`separator-${message.id}`}
                        style={{ zIndex }}
                        className={styles.daySeparator}
                      >
                        <Time
                          date={message.createdAt}
                          timeFormat={'day'}
                          size={'normal'}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            <div className={styles.seen}>
              {!!messages.length && (
                <AvatarGroup
                  componentsProps={{
                    additionalAvatar: {
                      variant: 'circular',
                      sx: {
                        width: 25,
                        height: 25,
                        fontSize: 'small',
                      },
                    },
                  }}
                >
                  {messages[0].readers.map((readerID) => {
                    const participant = selectedChat.chatParticipants.find(
                      (participant) =>
                        participant.id === readerID &&
                        readerID !== messages[0].authorID,
                    );
                    if (participant)
                      return (
                        <Tooltip
                          key={participant.id}
                          title={participant.profile.name}
                        >
                          <Avatar
                            sx={{
                              width: 25,
                              height: 25,
                              fontSize: '8px',
                              bgcolor: stringToColor(participant.profile.name),
                            }}
                            src={participant.profile.img}
                            alt={'img'}
                          >
                            {ConvertNameForImg(participant.profile.name)}
                          </Avatar>
                        </Tooltip>
                      );
                  })}
                </AvatarGroup>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
