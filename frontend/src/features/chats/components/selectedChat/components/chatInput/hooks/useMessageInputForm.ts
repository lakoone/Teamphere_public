import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { uploadFile } from '@/features/chats/components/selectedChat/components/chatInput/api/api';
import { fileDTO } from '@/entities/file/types';
import { InitMessageDTO } from '@/entities/message/types';
import { useAppSelector } from '@/utils/hooks/reduxHook';
import { useChatSocket } from '@/features/chats/context/ChatSocketContext';
import { AxiosError, AxiosProgressEvent, CancelToken } from 'axios';
import { throttle } from '@/utils/helpers/throttle';
import { useSnackbar } from '@/providers/SnackbarContext';
export const MessageSchema = z.object({
  text: z.string(),
  files: z.array(
    z.instanceof(File).refine((file) => file.size <= 40 * 1024 * 1024, {
      message: 'file size must be < 50 MB',
    }),
  ),
});
export type MessageForm = z.infer<typeof MessageSchema>;
export const useMessageInputForm = (
  setIsProcessing: (isProcessing: boolean) => void,
  setLoaded: (percent: number) => void,
  uploadCancelToken: CancelToken,
  chatCancelToken: CancelToken,
) => {
  const { showSnackbar } = useSnackbar();
  const chatSocket = useChatSocket();
  const userID = useAppSelector((state) => state.user.id);
  const selectedChat = useAppSelector(
    (state) => state.selectedChat.selectedChat,
  );
  const loadingIndicator = throttle(
    (event: AxiosProgressEvent) => {
      if (event.progress) {
        const uploadedPercent = Math.round(event.progress * 100);
        setLoaded(uploadedPercent);
      }
    },
    200,
    { disableLastCall: true },
  );
  const onProgress = (event: AxiosProgressEvent) => {
    loadingIndicator(event);
  };
  const { control, handleSubmit, setValue, watch, formState, getValues } =
    useForm<MessageForm>({
      mode: 'all',
      resolver: zodResolver(MessageSchema),
      defaultValues: {
        text: '',
        files: [],
      },
    });
  const onSubmit: SubmitHandler<MessageForm> = async (data) => {
    setIsProcessing(true);
    if ((data.text.length > 0 || data.files.length > 0) && selectedChat.id) {
      try {
        let uploadedFiles: fileDTO[] = [];
        if (data.files.length) {
          const res = await uploadFile(
            data.files,
            {
              chatID: selectedChat.id,
            },
            uploadCancelToken,
            onProgress,
          );

          if (res && res.status >= 200 && res.status < 300) {
            uploadedFiles = [...res.data.fileResponse];

            setLoaded(0);
          }
        }
        const mes: InitMessageDTO = {
          authorID: userID,
          chatID: selectedChat.id,
          text: data.text,
          files: uploadedFiles,
        };
        setValue('text', '');
        setValue('files', []);
        chatSocket?.sendMessage(mes);
      } catch (e) {
        if (e instanceof AxiosError) {
          if (e.message === 'canceled') {
            setValue('text', '');
            setValue('files', []);
            setIsProcessing(false);
            setLoaded(0);
            return;
          } else showSnackbar(e.message);
        }
      }
    }
    setIsProcessing(false);
  };
  return {
    control,
    handleSubmit,
    setValue,
    watch,
    formState,
    onSubmit,
    getValues,
  };
};
