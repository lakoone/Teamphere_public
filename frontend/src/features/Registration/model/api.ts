'use client';
import { RegisterUser } from '@/entities/User/types';
import { axiosInstance } from '@/utils/axios-config';

export const register = async (data: RegisterUser) => {
  const formData = new FormData();
  if (data.img) {
    const encodedName = encodeURIComponent(data.img.name);
    formData.append('img', data.img, encodedName);
  }
  formData.append(
    'authData',
    JSON.stringify({
      email: data.email,
      password: data.password,
    }),
  );
  formData.append(
    'userData',
    JSON.stringify({
      name: data.name,
      bio: data.bio || '',
      tagColor: data.tagColor,
      tag: data.tag,
      isPhotoVisible: data.isPhotoVisible,
    }),
  );
  const res = await axiosInstance.post('/api/user', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.status >= 200 && res.status < 300;
};
export const checkEmail = async (email: string) => {
  const res = await axiosInstance.get('api/auth/email', { params: { email } });

  return res.data as { isEmailExist: boolean };
};
