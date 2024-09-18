import { ChatType } from '@/features/chats/types/ChatType';
import { useAppSelector } from '@/utils/hooks/reduxHook';
import { UserType } from '@/entities/User';

export const useChatParticipants = () => {
  const friends: UserType[] = useAppSelector((state) => state.friends.friends);
  const chat: ChatType = useAppSelector(
    (state) => state.selectedChat.selectedChat,
  );
  return friends.find(
    (friend) =>
      chat.chatParticipants.findIndex(
        (participant) => participant.id === friend.id,
      ) > -1,
  );
};
