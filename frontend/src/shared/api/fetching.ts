import { axiosInstance } from '@/utils/axios-config';

export async function getFriends({
  page,
  name,
}: {
  page?: number;
  name?: string;
}) {
  const response = await axiosInstance.get('/api/user/myFriends', {
    params: { take: 20, skip: page ? page * 20 : 0, name: name },
  });
  return response.data;
}
export async function refreshToken() {
  return await axiosInstance.post(
    'api/auth/refresh',
    {},
    { withCredentials: true },
  );
}
