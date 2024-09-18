'use client';
import styles from './ChatCard.module.scss';
import { Badge, Typography } from '@mui/material';
import { Time } from '@/shared/components/Time';
import { useRouter } from '@/navigation/navigation';
import { UserType } from '@/entities/User/types';
import { MessageType } from '@/entities/message/types';
import { Colors } from '@/styles/colors/colors';
import { useAppSelector } from '@/utils/hooks/reduxHook';
import React from 'react';
import { getExtension } from '@/utils/helpers/getFileExtension';
import { UserAvatar } from '@/entities/User/components/UserAvatar/UserAvatar';

type ChatCardProps = {
  setIsChatListOpen: (prev: boolean) => void;
  chatID: string | number;
  title: string;
  isGroup: boolean;
  img: string;
  date?: string;
  participants: UserType[];
  lastMessage?: MessageType;
  newMessages?: number;
};

export const ChatCard: React.FC<ChatCardProps> = React.memo(
  (props: ChatCardProps) => {
    const router = useRouter();
    const user = useAppSelector((state) => state.user);
    const selectedChatID = useAppSelector(
      (state) => state.selectedChat.selectedChat.id,
    );
    const splitTitle = props.title.split('|');
    const title = splitTitle.find(
      (titleElement) => titleElement !== user.profile.name,
    );
    const splitImg = props.img.split('|');
    const userIndex = splitTitle.findIndex(
      (titleElement) => titleElement !== user.profile.name,
    );
    const img = splitImg[userIndex];
    const handleClick = () => {
      router.replace(`/app/message/${props.chatID}`);
      props.setIsChatListOpen(false);
    };

    return (
      <div
        className={`${styles.container} ${selectedChatID === props.chatID && styles.active}`}
        onClick={() => {
          handleClick();
        }}
      >
        <UserAvatar name={title || ''} size={'small'} img={img} />
        <div className={styles.content}>
          <div className={styles.Top}>
            <h4>{title}</h4>
            {props.date && (
              <Time date={props.date} timeFormat={'pastFrom'} size={'small'} />
            )}
          </div>
          <div className={styles.Bottom}>
            {props.lastMessage && (
              <div className={styles.messageText}>
                {props.lastMessage.authorID === user.id && (
                  <Typography color={Colors.SURFACE} variant="body1">
                    {`You: `}
                  </Typography>
                )}

                {props.lastMessage.files.length ? (
                  <>
                    <Typography
                      sx={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                      fontWeight={'bold'}
                      color={
                        props.newMessages && props.newMessages < 1
                          ? Colors.SURFACE
                          : Colors.WHITE
                      }
                      variant="body1"
                    >
                      {
                        props.lastMessage.files[
                          props.lastMessage.files.length - 1
                        ].name
                      }
                    </Typography>
                    <Typography
                      sx={{
                        width: 'fit-content',
                      }}
                      fontWeight={'normal'}
                      color={
                        props.newMessages && props.newMessages < 1
                          ? Colors.SURFACE
                          : Colors.WHITE
                      }
                      variant="body1"
                    >
                      {`.${getExtension(
                        props.lastMessage.files[
                          props.lastMessage.files.length - 1
                        ].type,
                      )}`}
                    </Typography>
                  </>
                ) : (
                  <Typography
                    color={
                      props.newMessages && props.newMessages < 1
                        ? Colors.SURFACE
                        : Colors.WHITE
                    }
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    variant="body1"
                  >
                    {props.lastMessage.text}
                  </Typography>
                )}
              </div>
            )}
            {props.newMessages ? (
              <div className={styles.badge}>
                <Badge
                  anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                  invisible={!props.newMessages}
                  badgeContent={props.newMessages}
                  color="primary"
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  },
);
