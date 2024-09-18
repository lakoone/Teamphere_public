import { axiosInstance } from '@/utils/axios-config';

export const getChatIDByFriend = async (friendID: number) => {
  return await axiosInstance.get('api/chat/byFriend', {
    params: { friendID: friendID },
  });
};
