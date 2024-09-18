import { ChatMetadata } from '@/features/chats/types/ChatMetadata';
import { getChatIDByFriend } from '@/shared/api/getChatIdByFriend';
import { useRouter } from '@/navigation/navigation';
import { useSnackbar } from '@/providers/SnackbarContext';
import { AxiosError } from 'axios';

export const useLinkToChat = (chats: ChatMetadata[]) => {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  return async (friendID: number) => {
    const foundChat = chats.find((chat) => {
      const isChat = chat.participants.find((friend) => friend.id === friendID);
      if (isChat) return true;
    });
    if (foundChat) {
      router.replace(`/app/message/${foundChat.id}`);
    } else {
      try {
        const response = await getChatIDByFriend(friendID);
        if (response.status >= 200 && response.status < 300) {
          const chatID = response.data;
          router.replace(`/app/message/${chatID}`);
        }
      } catch (e) {
        if (e instanceof AxiosError) {
          showSnackbar(e.message, 'error');
        } else {
          console.error(e);
          throw e;
        }
      }
    }
  };
};
