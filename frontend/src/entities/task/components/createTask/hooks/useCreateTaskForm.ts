import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateTaskSchema,
  CreateTaskForm,
} from '@/entities/task/types/TaskType';
import { postTask } from '@/entities/task/components/createTask/api/api';
import { useSnackbar } from '@/providers/SnackbarContext';
import { useAppSelector } from '@/utils/hooks/reduxHook';
import { throttle } from '@/utils/helpers/throttle';
import { AxiosError, AxiosProgressEvent, CancelToken } from 'axios';

export const useCreateTaskForm = (
  SelectedDate: Date,
  setOpen: (isOpen: boolean) => void,
  setIsProcessing: (processing: boolean) => void,
  setLoaded: (loaded: number) => void,
  cancelToken: CancelToken,
) => {
  const { showSnackbar } = useSnackbar();
  const chat = useAppSelector((state) => state.selectedChat.selectedChat);

  const loadingIndicator = throttle(
    (event: AxiosProgressEvent) => {
      if (event.progress) setLoaded(Math.round(event.progress * 100));
    },
    200,
    { disableLastCall: true },
  );
  const onProgress = (event: AxiosProgressEvent) => {
    loadingIndicator(event);
  };
  const onSubmit: SubmitHandler<CreateTaskForm> = async (data) => {
    setIsProcessing(true);
    try {
      const res = await postTask(
        {
          chatID: chat.id as string,
          deadline: data.deadline,
          forUsersID: data.responsible,
          title: data.title,
          taskText: data.description || '',
          taskFiles: data.files,
        },
        cancelToken,
        onProgress,
      );
      if (res.status >= 200 && res.status < 300) {
        setIsProcessing(false);
        showSnackbar('Success', 'success');
        setOpen(false);
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.message === 'canceled') {
          setIsProcessing(false);
        } else showSnackbar(e.message, 'error');
      }
    }
  };

  const {
    control,
    trigger,
    handleSubmit,
    setValue,
    watch,
    formState,
    getValues,
  } = useForm<CreateTaskForm>({
    mode: 'all',
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      title: '',
      responsible: [],
      files: [],
      deadline: SelectedDate,
      description: '',
    },
  });

  return {
    control,
    handleSubmit,
    setValue,
    watch,
    formState,
    onSubmit,
    trigger,
    getValues,
  };
};
