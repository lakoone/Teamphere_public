'use client';
import styles from './message.module.scss';
import { useTranslations } from 'next-intl';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { Colors } from '@/styles/colors/colors';
import { useChatOpen } from '@/features/chats/context/ChatOpenContext';
import { useEffect } from 'react';
import { useAppDispatch } from '@/utils/hooks/reduxHook';
import { selectChat } from '@/store/Slices/selectedChatSlice';

const MessagePage = () => {
  const t = useTranslations('MessagePage');
  const { setIsChatListOpen } = useChatOpen();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  useEffect(() => {
    setIsChatListOpen(true);
    dispatch(
      selectChat({
        name: '',
        chatParticipants: [],
        id: '',
        messages: [],
        isGroup: false,
        tasks: [],
        img: '',
      }),
    );
  }, []);
  return (
    !isSmallScreen && (
      <div className={styles.nothing}>
        <Typography
          sx={{
            color: Colors.SURFACE,
            textAlign: 'center',
          }}
          component={'p'}
          variant={'h5'}
        >
          {t('SelectChat')}
        </Typography>
      </div>
    )
  );
};
export default MessagePage;
