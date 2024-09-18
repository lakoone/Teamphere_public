import { axiosInstance } from '@/utils/axios-config';
import { UpdateProfileData } from '@/features/profile/types';
import { UserProfile } from '@/entities/User/types';

export const sendUpdateProfile = async (body: UpdateProfileData) => {
  try {
    const { newImg, ...rest } = body;
    const formData = new FormData();
    if (newImg[0]) {
      formData.append(
        'files',
        body.newImg[0],
        encodeURIComponent(body.newImg[0].name),
      );
    }

    formData.append('data', JSON.stringify(rest));

    const response = await axiosInstance.patch('/api/user', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data as {
      userData: UserProfile;
    };
  } catch (error) {
    throw new Error('Failed to update profile');
  }
};
