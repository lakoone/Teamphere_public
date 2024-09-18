'use client';
import styles from './Friends.module.scss';
import {
  Button,
  IconButton,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { User } from '@/entities/User';
import { Widget } from '@/shared/components/Widget';
import { DialogBackdrop } from '@/shared/components/DialogBackdrop';
import { SearchUser } from '@/features/SearchUser';
import AddIcon from '@/shared/icons/AddIcon';
import { useTranslations } from 'next-intl';
import { UserType } from '@/entities/User/types';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/reduxHook';
import { addFriends, removeFriend } from '@/store/Slices/friendSlice';
import { deleteFriend, fetchFriends, sendFriendRequest } from '../api/api';
import { useSnackbar } from '@/providers/SnackbarContext';
import { AxiosError } from 'axios';
import { useLinkToChat } from '@/shared/hooks/useLinkToChat';

export const Friends: React.FC = () => {
  const friends = useAppSelector((state) => state.friends.friends);
  const dispatch = useAppDispatch();
  const [skeleton, setSkeleton] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [search, setSearch] = React.useState('');
  const [filteredFriends, setFilteredFriends] = React.useState(friends);
  const [open, setOpen] = React.useState(false);
  const chats = useAppSelector((state) => state.chats.chats);
  const t = useTranslations('FriendsPage');
  const { showSnackbar } = useSnackbar();
  const LinkToChat = useLinkToChat(chats);
  const getFriends = async () => {
    try {
      const resData = await fetchFriends({ take: 20, skip: friends.length });
      if (resData) {
        dispatch(addFriends(resData));
        setFilteredFriends(resData);
        setSkeleton(false);
      } else {
        console.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    setFilteredFriends(friends);
  }, [friends]);

  const handleClose = () => {
    setOpen(false);
  };
  const hendleClick = () => {
    setOpen(true);
  };
  const handleSendRequest = async () => {
    const IDs = selectedUsers.map((user) => user.id);
    try {
      const res = await sendFriendRequest(IDs);
      if (res.status >= 200 && res.status < 300) {
        setSelectedUsers([]);
        showSnackbar(t('RequestSent'), 'success');
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const messageTranslate = error.response
          ? error.response.data.message ===
            'The request has already been sent or accepted.'
            ? t('ReqAlreadyExist')
            : error.response?.data.message
          : error;
        showSnackbar(messageTranslate, 'error');
      }
    }
  };

  const handleRemoveFriend = async (friendID: number) => {
    try {
      const res = await deleteFriend(friendID);
      if (res.status) dispatch(removeFriend(friendID));
    } catch (error: any) {
      showSnackbar(error.message, 'error');
    }
  };
  const searchFriend = (name: string) => {
    if (name.length === 0) {
      setFilteredFriends(friends);
      return;
    }
    setFilteredFriends(
      friends.filter((friend) =>
        friend.profile.name.toLowerCase().includes(name.toLowerCase()),
      ),
    );
  };

  React.useEffect(() => {
    searchFriend(search);
  }, [search]);

  return (
    <>
      {' '}
      <DialogBackdrop
        description={t('FindUsersToAddAsFriends')}
        actions={
          <>
            <Button
              disableRipple
              sx={{ textTransform: 'none' }}
              color={'error'}
              onClick={handleClose}
            >
              {t('Close')}
            </Button>
            <Button
              disableRipple
              disabled={!selectedUsers.length}
              sx={{ textTransform: 'none' }}
              color={'success'}
              onClick={handleSendRequest}
              type="submit"
            >
              {t('SendRequest')}
            </Button>
          </>
        }
        content={
          <SearchUser
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
          />
        }
        title={t('UserSearch')}
        open={open}
        handleClose={handleClose}
      />
      <Widget>
        <div className={styles.container}>
          <section className={styles.top}>
            <TextField
              inputProps={{ maxLength: 40, autoComplete: 'off' }}
              color={'primary'}
              id="standard-basic"
              label={t('Search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              variant={'filled'}
              size="small"
            />
            <IconButton onClick={hendleClick}>
              <AddIcon />
            </IconButton>
          </section>

          <div className={styles.friends}>
            {skeleton ? (
              <Skeleton
                animation="wave"
                variant="rounded"
                width={'100%'}
                height={60}
              />
            ) : (
              <>
                {!friends.length && (
                  <Typography sx={{ margin: 'auto' }}>
                    {t('NoFriends')}
                  </Typography>
                )}

                {filteredFriends.map((friend) => {
                  return (
                    <div key={friend.id} className={styles.friend}>
                      <div className={styles.user}>
                        <User size={'medium'} user={friend} />
                      </div>
                      <section className={styles.actions}>
                        <Button
                          sx={{
                            textTransform: 'none',
                            width: 'fit-content',
                            maxWidth: '200px',
                          }}
                          fullWidth
                          disableRipple
                          color={'inherit'}
                          onClick={async () => await LinkToChat(friend.id)}
                          variant={'text'}
                        >
                          {t('SendMessage')}
                        </Button>
                        <Button
                          sx={{
                            textTransform: 'none',
                            width: 'fit-content',
                            maxWidth: '200px',
                          }}
                          fullWidth
                          disableRipple
                          color={'error'}
                          variant={'text'}
                          onClick={() => handleRemoveFriend(friend.id)}
                        >
                          {t('Delete')}
                        </Button>
                      </section>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </Widget>
    </>
  );
};
