import { axiosInstance } from '@/utils/axios-config';

export const fetchChatMessages = async (params: {
  chatID: string;
  lastLoadedMessageDate: string;
  take: number;
}) => {
  return await axiosInstance.get(`api/chat/messages`, {
    params,
    withCredentials: true,
  });
};
