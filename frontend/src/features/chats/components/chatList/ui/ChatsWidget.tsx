'use client';
import styles from './ChatsWidget.module.scss';
import { Header } from '@/shared/components/Header';
import {
  Divider,
  IconButton,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ChatCard } from '@/entities/ChatCard';
import { useTranslations } from 'next-intl';
import { Colors } from '@/styles/colors/colors';
import { ChatMetadata } from '@/features/chats/types/ChatMetadata';
import { useAppSelector } from '@/utils/hooks/reduxHook';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';
import { useChatOpen } from '@/features/chats/context/ChatOpenContext';
import { usePathname } from '@/navigation/navigation';

export const ChatsWidget: React.FC = () => {
  const t = useTranslations('MessagePage');
  const [search, setSearch] = React.useState('');
  const [isMoreData, setIsMoreData] = useState(true);
  // const [lastFoundName, setLastFoundName] = useState('');
  const { toggleChatList, isChatListOpen, setIsChatListOpen } = useChatOpen();
  const chatsMetadata: ChatMetadata[] = useAppSelector(
    (state) => state.chats.chats,
  );
  const pathname = usePathname();
  const splitPath = pathname.split('/');
  const ChatID = splitPath[splitPath.length - 1];
  const isChatSelected = chatsMetadata.find((chat) => chat.id === ChatID);
  const [searchResult, setSearchResult] =
    useState<ChatMetadata[]>(chatsMetadata);

  const sortChats = (chats: ChatMetadata[]) => {
    return [...chats].sort((a, b) => {
      if (a.lastMessage && b.lastMessage)
        return (
          Date.parse(b.lastMessage.createdAt) -
          Date.parse(a.lastMessage.createdAt)
        );
      else {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }
        return 0;
      }
    });
  };
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const filterChats = (name: string) => {
    return sortChats(chatsMetadata).filter((chat) =>
      chat.isGroup
        ? chat.title.toLowerCase().includes(name.toLowerCase())
        : chat.participants[0].profile.name
            .toLowerCase()
            .includes(name.toLowerCase()),
    );
  };
  const searchChat = async (name: string) => {
    // if (!isMoreData && lastFoundName.length > name.length) {
    //   setIsMoreData(true); // Встановлення стану через useState
    //   setLastFoundName('');
    // }
    if (name.length === 0) {
      setSearchResult(chatsMetadata);
      return;
    }
    const chats = filterChats(name);

    if (chats.length === 0 && isMoreData) {
      // const res = await getFriends({ name });
      // if (Array.isArray(res) && res.length === 0) {
      //   setIsMoreData(false); // Оновлення стану при відсутності результатів
      //   setLastFoundName(name);
      // } else if (Array.isArray(res)) {
      //   setSearchResult((prev) => ({
      //     ...prev,
      //     foundFriends: res,
      //   }));
      // }
    } else {
      setSearchResult(chats);
    }
  };
  useEffect(() => {
    if (!isChatListOpen && isChatSelected === undefined) {
      setIsChatListOpen(true);
    }
  }, []);
  useEffect(() => {
    searchChat(search);
  }, [search]);
  useEffect(() => {
    setSearchResult((prev) => sortChats(chatsMetadata));
  }, [chatsMetadata]);

  return chatsMetadata ? (
    <div className={`${styles.container} ${!isChatListOpen && styles.closed}`}>
      <Header
        style={{
          backgroundColor: 'var(--bg-color2)',
          justifyContent: 'space-between',
          gap: '10px',
          minHeight: '60px',
          maxHeight: '60px',
        }}
      >
        <h3>{t('Messages')}</h3>
        {isSmallScreen && isChatSelected && (
          <IconButton onClick={() => toggleChatList()}>
            <CloseIcon />
          </IconButton>
        )}
      </Header>
      <div className={styles.search}>
        <TextField
          sx={{
            width: '100%',
          }}
          inputProps={{
            maxLength: 40,
            autoComplete: 'off',
          }}
          color="primary"
          id="standard-basic"
          onChange={(e) => setSearch(e.target.value)}
          label={t('Search')}
          variant="filled"
          size="small"
        />
      </div>
      <section className={styles.content}>
        <div className={styles.scroll}>
          {searchResult.length > 0 ? (
            searchResult.map((chat) => {
              if (chat.lastMessage)
                return (
                  <ChatCard
                    setIsChatListOpen={setIsChatListOpen}
                    isGroup={chat.isGroup}
                    participants={chat.participants}
                    chatID={chat.id}
                    key={chat.id}
                    newMessages={chat.unreadMessages}
                    title={chat.title}
                    img={chat.img}
                    date={chat.lastMessage.createdAt}
                    lastMessage={chat.lastMessage}
                  />
                );
            })
          ) : (
            <Typography
              sx={{ margin: 'auto' }}
              color={Colors.SURFACE}
              fontWeight={'bold'}
              variant="body1"
            >
              {t('chatNotFound')}
            </Typography>
          )}

          {
            <>
              <Divider flexItem orientation="horizontal" />
              <Typography fontWeight={'bold'} variant="body1">
                {t('StartNewChat')}
              </Typography>

              {searchResult.length > 0 &&
                searchResult.map((chat) => {
                  if (!chat.lastMessage) {
                    return (
                      <ChatCard
                        setIsChatListOpen={setIsChatListOpen}
                        isGroup={false}
                        participants={chat.participants}
                        key={chat.id}
                        chatID={chat.id}
                        title={chat.title}
                        img={chat.img}
                      />
                    );
                  } else {
                    return null;
                  }
                })}
            </>
          }
        </div>
      </section>
    </div>
  ) : (
    `LOADING`
  );
};
