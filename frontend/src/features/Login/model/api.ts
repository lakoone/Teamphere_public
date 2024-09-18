import { axiosInstance } from '@/utils/axios-config';

export const login = async (email: string, password: string) => {
  return await axiosInstance.post('api/auth/login', {
    email,
    password,
  });
};
