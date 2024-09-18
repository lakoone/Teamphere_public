'use client';
import styles from './ProfileCard.module.scss';
import { Card } from '@/shared/components/Card';
import { UserRole } from '@/shared/components/UserRole';
import { Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { useTranslations } from 'next-intl';
import { Colors } from '@/styles/colors/colors';
import { UserType } from '@/entities/User/types';
import { UserAvatar } from '@/entities/User/components/UserAvatar/UserAvatar';
import { useLinkToChat } from '@/shared/hooks/useLinkToChat';
import { useAppSelector } from '@/utils/hooks/reduxHook';

export type ProfileCardProps = {
  user: UserType;
  handleClose?: React.MouseEventHandler<HTMLButtonElement>;
};
export const ProfileCard = React.forwardRef<HTMLDivElement, ProfileCardProps>(
  (props, ref) => {
    const { id, profile } = props.user;
    const t = useTranslations('Buttons');
    const userID = useAppSelector((state) => state.user.id);
    const friends = useAppSelector((state) => state.friends.friends);
    const isFriend = friends.find((friend) => friend.id === props.user.id);
    const cleanTag = profile.tag.trimStart();
    const chats = useAppSelector((state) => state.chats.chats);
    const linkToChat = useLinkToChat(chats);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    return (
      <Card margin={'0 15px'} ref={ref}>
        <section className={styles.photo}>
          <UserAvatar
            img={profile.img}
            name={profile.name}
            size={isSmallScreen ? 'medium' : 'large'}
          />
        </section>
        <section className={styles.userData}>
          <section className={styles.top}>
            <div className={styles.nameContainer}>
              <h2 className={styles.name}>{profile.name}</h2>
              <Typography
                color={Colors.SURFACE}
                fontSize={15}
              >{`@${id}`}</Typography>
            </div>
            {cleanTag && (
              <UserRole
                size={'medium'}
                role={cleanTag}
                color={profile.tagColor}
              />
            )}
          </section>
          {profile.bio.length > 0 && (
            <div className={styles.Bio}>
              <p>{profile.bio}</p>
            </div>
          )}

          <div className={styles.Buttons}>
            {props.user.id !== userID && isFriend !== undefined && (
              <Button
                sx={{ textTransform: 'none' }}
                fullWidth
                disabled={!props.handleClose}
                disableRipple
                onClick={async (event) => {
                  await linkToChat(props.user.id);
                  if (props.handleClose) props.handleClose(event);
                }}
                color={'info'}
                variant={'outlined'}
              >
                {t('SendMessage')}
              </Button>
            )}
            <Button
              sx={{ textTransform: 'none' }}
              fullWidth
              disabled={!props.handleClose}
              disableRipple
              onClick={props.handleClose}
              color={'error'}
              variant={'outlined'}
            >
              {t('Close')}
            </Button>
          </div>
        </section>
      </Card>
    );
  },
);
