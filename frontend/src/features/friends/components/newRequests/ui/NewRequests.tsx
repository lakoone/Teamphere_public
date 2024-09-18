'use client';
import styles from './NewRequests.module.scss';
import { Button, Divider, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { User } from '@/entities/User';
import { Widget } from '@/shared/components/Widget';
import { useTranslations } from 'next-intl';
import { UserType } from '@/entities/User/types';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/reduxHook';
import { addFriends } from '@/store/Slices/friendSlice';
import {
  clearRequests,
  deleteRequest,
  setRequests,
} from '@/store/Slices/requestSlice';
import { acceptRequests, fetchUsersData, rejectRequests } from '../api/api';

export const NewRequests: React.FC = () => {
  const [search, setSearch] = React.useState('');
  const friendRequests = useAppSelector((state) => state.requests.requests);
  const [filteredRequests, setFilteredRequests] = React.useState<UserType[]>(
    [],
  );
  const [users, setUsers] = useState<UserType[]>([]);
  const IDs: Set<number> = new Set<number>();
  const dispatch = useAppDispatch();
  const t = useTranslations('FriendsPage');
  const searchFriend = (name: string) => {
    if (name.length === 0) {
      setFilteredRequests(users);
      return;
    }
    setFilteredRequests(
      filteredRequests.filter((friend) =>
        friend.profile.name.toLowerCase().includes(name.toLowerCase()),
      ),
    );
  };
  const handleAccept = async (requestIDs: number[], users: UserType[]) => {
    const res = await acceptRequests(requestIDs);
    if (res.status >= 200 && res.status < 300) {
      const arr = friendRequests.filter((req) => !requestIDs.includes(req.id));

      dispatch(setRequests(arr));

      if (users.length > 0) {
        dispatch(addFriends(users));
      }
    } else throw Error('Bad Accept Request');
  };
  const handleReject = async (requestIDs: number[]) => {
    if (requestIDs.length > 0) {
      const res = await rejectRequests(requestIDs);
      if (res.status >= 200 && res.status < 300) {
        requestIDs.length > 1
          ? dispatch(clearRequests())
          : dispatch(deleteRequest(requestIDs[0]));
      } else throw Error('Bad Reject Request');
    } else throw Error('requestIDs is empty');
  };
  useEffect(() => {
    friendRequests.forEach((req) => {
      IDs.add(req.fromUserId);
    });
    const fetchUsers = async () => {
      try {
        if (IDs.size > 0) {
          const res = await fetchUsersData(Array.from(IDs), 20);
          if (res.status >= 200 && res.status < 300) {
            const data = res.data;

            setFilteredRequests(data);
            setUsers(data);
          } else {
            console.error('Failed to fetch users:', res.statusText);
          }
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [friendRequests]);

  React.useEffect(() => {
    searchFriend(search);
  }, [search]);

  return (
    <Widget title={t('NewRequests')}>
      <Divider flexItem />
      <div className={styles.container}>
        <section className={styles.top}>
          <TextField
            inputProps={{ maxLength: 40, autoComplete: 'off' }}
            color={'primary'}
            id="standard-basic"
            label={t('Search')}
            onChange={(e) => setSearch(e.target.value)}
            variant={'filled'}
            size="small"
          />
          <Button
            sx={{
              textTransform: 'none',
              width: 'fit-content',
              maxWidth: '180px',
            }}
            fullWidth
            disableRipple
            onClick={async () => {
              const ids = friendRequests.map((req) => req.id);
              await handleAccept(ids, filteredRequests);
            }}
            color={'success'}
            variant={'outlined'}
          >
            {t('AcceptAll')}
          </Button>
          <Button
            sx={{
              textTransform: 'none',
              width: 'fit-content',
              maxWidth: '180px',
            }}
            fullWidth
            onClick={() => {
              const ids = friendRequests.map((req) => req.id);
              handleReject(ids);
            }}
            disableRipple
            color={'error'}
            variant={'outlined'}
          >
            {t('RejectAll')}
          </Button>
        </section>
        {!!filteredRequests.length && (
          <div className={styles.requests}>
            {filteredRequests.map((requestFrom) => {
              return (
                <div key={requestFrom.id} className={styles.request}>
                  <div className={styles.user}>
                    <User size={'medium'} user={requestFrom} />
                  </div>
                  <section className={styles.actions}>
                    <Button
                      sx={{
                        textTransform: 'none',
                        maxWidth: '100px',
                      }}
                      fullWidth
                      onClick={() => {
                        const req = friendRequests.find(
                          (req) => req.fromUserId === requestFrom.id,
                        );
                        if (req) handleAccept([req.id], [requestFrom]);
                      }}
                      disableRipple
                      color={'success'}
                      variant={'outlined'}
                    >
                      {t('Add')}
                    </Button>
                    <Button
                      sx={{
                        textTransform: 'none',
                        maxWidth: '100px',
                      }}
                      onClick={() => {
                        const req = friendRequests.find(
                          (req) => req.fromUserId === requestFrom.id,
                        );
                        if (req) handleReject([req.id]);
                      }}
                      fullWidth
                      disableRipple
                      color={'error'}
                      variant={'outlined'}
                    >
                      {t('Reject')}
                    </Button>
                  </section>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Widget>
  );
};
