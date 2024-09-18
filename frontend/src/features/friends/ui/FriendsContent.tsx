'use client';
import styles from './FriendsContent.module.scss';
import { NewRequests } from '../components/newRequests/ui/NewRequests';
import { Divider } from '@mui/material';
import { Friends } from '../components/friendList/ui/Friends';
import { useAppSelector } from '@/utils/hooks/reduxHook';

const FriendsContent = () => {
  const friendRequests = useAppSelector((state) => state.requests.requests);

  return (
    <div className={styles.container}>
      {!!friendRequests?.length && (
        <>
          <NewRequests />
          <Divider orientation="horizontal" flexItem />
        </>
      )}
      <Friends />
    </div>
  );
};

export { FriendsContent };
