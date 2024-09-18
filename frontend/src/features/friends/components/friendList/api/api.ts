import { axiosInstance } from '@/utils/axios-config';

export const fetchFriends = async (params: { take: number; skip: number }) => {
  const res = await axiosInstance.get('/api/user/myFriends', { params });
  if (res.statusText == 'OK') {
    return res.data;
  } else throw Error(res.statusText);
};
export const sendFriendRequest = async (friendIDs: number[]) => {
  return await axiosInstance.post('/api/user/request', { friendIDs });
};
export const deleteFriend = async (friendID: number) => {
  return await axiosInstance.post('/api/user/deleteFriend', { friendID });
};
