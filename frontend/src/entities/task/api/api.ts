import { TaskForm } from '@/entities/task/types/TaskType';
import { axiosInstance } from '@/utils/axios-config';
import { AxiosProgressEvent } from 'axios';

export const updateTask = async (
  taskID: string,
  data: TaskForm,
  onProgress?: (progressEvent: AxiosProgressEvent) => void,
) => {
  const formData = new FormData();
  data.descriptionNewFiles.forEach((file) => {
    const encodedName = encodeURIComponent(file.name);
    formData.append('newDescriptionFiles', file, encodedName);
  });
  data.answerNewFiles.forEach((file) => {
    const encodedName = encodeURIComponent(file.name);
    formData.append('newAnswerFiles', file, encodedName);
  });
  formData.append(
    'data',
    JSON.stringify({
      taskText: data.description,
      answerText: data.answer,
      status: data.status,
    }),
  );

  await axiosInstance.patch(`/api/task/${taskID}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: onProgress,
  });
};
