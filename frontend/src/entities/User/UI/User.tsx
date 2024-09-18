'use client';
import styles from './User.module.scss';
import { IconButton, Typography } from '@mui/material';
import React from 'react';
import { Colors } from '@/styles/colors/colors';
import { UserType } from '@/entities/User/types';
import { UserAvatar } from '@/entities/User/components/UserAvatar/UserAvatar';
import { UserModal } from '@/entities/User/components/UserModal/UserModal';
import { useModal } from '@/shared/hooks/useModal';

type UserProps = {
  withID?: boolean;
  noClick?: boolean;
  user: UserType;
  size: 'small' | 'medium' | 'avatar' | 'messageAvatar';
};

export const User: React.FC<UserProps> = (props: UserProps) => {
  const { isOpen, openModal, closeModal } = useModal();
  const sxOptions = {
    borderRadius: '10px',
    padding: '0px',
    textTransform: 'none',
    fontWeight: 'medium',
    fontSize: '13px',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '10px',
    flex: '1',
    overflow: 'hidden',
  };
  if (props.size === 'medium') {
    sxOptions.fontSize = '16px';
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!props.noClick) {
      event.stopPropagation();
      openModal();
    }
  };

  return (
    <>
      <UserModal open={isOpen} handleClose={closeModal} user={props.user} />
      <IconButton
        onClick={handleClick}
        disableRipple
        sx={
          props.size === 'avatar'
            ? { ...sxOptions, width: 'fit-content', flex: 'none' }
            : { ...sxOptions }
        }
        className={`${styles.container}${props.size === 'medium' ? styles.medium : null}`}
      >
        <UserAvatar
          size={
            props.size === 'avatar' || props.size === 'small'
              ? 'small'
              : 'medium'
          }
          name={props.user.profile.name}
          img={props.user.profile.img}
        />
        {props.size !== 'avatar' && props.size !== 'messageAvatar' && (
          <>
            <Typography
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              variant="inherit"
              component="h5"
              className={styles.name}
            >
              {props.user.profile.name}
            </Typography>
            {props.withID && (
              <Typography
                className={styles.id}
                color={Colors.SURFACE}
                fontSize={10}
              >{`@${props.user.id}`}</Typography>
            )}
          </>
        )}
      </IconButton>
    </>
  );
};
