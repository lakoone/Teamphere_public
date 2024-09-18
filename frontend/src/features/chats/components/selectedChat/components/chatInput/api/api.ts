import { axiosInstance } from '@/utils/axios-config';
import { AxiosProgressEvent, CancelToken } from 'axios';

export const uploadFile = async (
  files: File[],
  data: {
    chatID?: string;
    task?: { id: string; IsDescription: boolean };
  },
  cancelToken: CancelToken,
  onProgress: (progressEvent: AxiosProgressEvent) => void,
) => {
  const formData = new FormData();
  files.forEach((file) => {
    const encodedName = encodeURIComponent(file.name);
    formData.append('files', file, encodedName);
  });
  if (data.task) formData.append('task', JSON.stringify(data.task));
  if (data.chatID) formData.append('chatID', data.chatID);

  return await axiosInstance.post('/api/storage/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    cancelToken,
    onUploadProgress: onProgress,
  });
};
