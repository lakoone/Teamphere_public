import styles from './SearchUser.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import { Divider, TextField, Tooltip } from '@mui/material';
import { User } from '@/entities/User';
import { axiosInstance } from '@/utils/axios-config';
import { throttle } from '@/utils/helpers/throttle';
import { UserType } from '@/entities/User/types';
import AlreadyFriendIcon from '@/shared/icons/AlreadyFriendIcon';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/utils/hooks/reduxHook';

interface SearchUserProps {
  selectedUsers: UserType[];
  setSelectedUsers: (users: UserType[]) => void;
}

export const SearchUser: React.FC<SearchUserProps> = ({
  selectedUsers,
  setSelectedUsers,
}) => {
  const t = useTranslations('FriendsPage');
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [search, setSearch] = React.useState<string>('');
  const [users, setUsers] = useState<UserType[]>([]);
  const friends = useAppSelector((state) => state.friends.friends);
  const ClickUser = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    user: UserType,
  ) => {
    event.stopPropagation();
    if (selectedUsers.includes(user))
      setSelectedUsers(
        selectedUsers.filter((selected) => selected.id !== user.id),
      );
    else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };
  const fetchUsers = useCallback(
    throttle(async (name: string) => {
      const res = await axiosInstance.post('/api/user/publicUsers', {
        name: name,
        take: 10,
      });
      setUsers(res.data);
    }, 1000),
    [],
  );

  useEffect(() => {
    if (!isFirstRender) {
      fetchUsers(search);
    }
    setIsFirstRender(false);
  }, [search]);
  return (
    <div className={styles.container}>
      <TextField
        autoFocus
        fullWidth={true}
        margin="dense"
        id="name"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
        }}
        name="name"
        label={t('Search')}
        type="text"
        variant="filled"
        error={!selectedUsers.length && !users.length}
        helperText={!selectedUsers.length && !users.length && t('UserNotFound')}
      />
      {selectedUsers.map((user) => (
        <div
          key={user.id}
          onClick={(event) => ClickUser(event, user)}
          className={`${styles.profile} ${styles.selected}`}
        >
          <User noClick={true} size={'small'} user={user} />
        </div>
      ))}
      {!!users.length && <Divider flexItem orientation={'horizontal'} />}
      {users.map((user) => {
        const included = selectedUsers.find((el) => el.id === user.id);
        const isFriend = friends.find((friend) => friend.id === user.id);
        if (!included)
          return (
            <div
              key={user.id}
              onClick={(event) => !isFriend && ClickUser(event, user)}
              className={`${styles.profile} ${!isFriend && styles.Nofriend} `}
            >
              <User noClick={true} size={'small'} user={user} />
              {isFriend && (
                <Tooltip title={t('AlreadyInFriendsList')}>
                  <div>
                    <AlreadyFriendIcon />
                  </div>
                </Tooltip>
              )}
            </div>
          );
        return null;
      })}
    </div>
  );
};
