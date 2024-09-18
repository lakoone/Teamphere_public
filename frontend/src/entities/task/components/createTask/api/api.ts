import { axiosInstance } from '@/utils/axios-config';
import { AxiosProgressEvent, CancelToken } from 'axios';

type postTaskDTO = {
  title: string;
  deadline: Date;
  forUsersID: number[];
  taskText: string;
  taskFiles: File[];
  chatID: string;
};
export const postTask = async (
  taskDTO: postTaskDTO,
  cancelToken: CancelToken,
  onProgress: (progressEvent: AxiosProgressEvent) => void,
) => {
  const formData = new FormData();

  taskDTO.taskFiles.forEach((file) => {
    const encodedName = encodeURIComponent(file.name);
    formData.append('files', file, encodedName);
  });
  formData.append(
    'data',
    JSON.stringify({
      title: taskDTO.title,
      deadline: taskDTO.deadline,
      forUsersID: taskDTO.forUsersID,
      taskText: taskDTO.taskText,
      chatID: taskDTO.chatID,
    }),
  );
  return await axiosInstance.post('/api/task', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    cancelToken,
    onUploadProgress: onProgress,
  });
};
