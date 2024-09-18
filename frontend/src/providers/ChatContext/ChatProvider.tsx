'use client';
import React, {
  useState,
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from 'react';
import { ChatType } from '@/features/chats/types/ChatType';
import { MessageType } from '@/entities/message/types';
import { ChatMetadata } from '@/features/chats/types/ChatMetadata';
import { useAppSelector } from '@/utils/hooks/reduxHook';

interface ChatContextValue {
  chatsMetadata: ChatMetadata[];
  selectedChat: ChatType | null;
  setSelectedChat: (chat: ChatType) => void;
  addMessages: (messages: MessageType[]) => void;
  setChatsMetadata: (chatsMetadata: ChatMetadata[]) => void;
}
const ChatContext = createContext<ChatContextValue>({
  chatsMetadata: [],
  selectedChat: null,
  setSelectedChat: () => {},
  addMessages: () => {},
  setChatsMetadata: () => {},
});
export const useChatsMetadata = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatsMetadata must be used within a ChatProvider');
  }
  return {
    chatsMetadata: context.chatsMetadata,
    setChatsMetadata: context.setChatsMetadata,
  };
};
export const useSelectedChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useSelectedChat must be used within a ChatProvider');
  }
  return {
    addMessages: context.addMessages,
    selectedChat: context.selectedChat,
    setSelectedChat: context.setSelectedChat,
  };
};

const ChatProvider: React.FC<{
  children: ReactNode;
  initialChatsMetadata: ChatMetadata[];
}> = ({
  children,
  initialChatsMetadata,
}: {
  children: ReactNode;
  initialChatsMetadata: ChatMetadata[];
}) => {
  const [selectedChat, setSelectedChat] = useState<ChatType | null>(null);
  const [chatsMetadata, setChatsMetadata] = useState<ChatMetadata[]>(
    initialChatsMetadata || [],
  );
  const user = useAppSelector((state) => state.user);
  const addMessages = useCallback(
    (messages: MessageType[]) => {
      if (selectedChat) {
        const index = chatsMetadata.findIndex(
          (chat) => chat.id === messages[0].chatID,
        );

        const isNewMessages = selectedChat?.messages[0]
          ? new Date(messages[0].createdAt) >
            new Date(selectedChat?.messages[0].createdAt)
          : true;

        const sortedArr = isNewMessages
          ? [...messages, ...selectedChat.messages]
          : [...selectedChat.messages, ...messages];
        setSelectedChat((prev) =>
          prev !== null ? { ...prev, messages: sortedArr } : prev,
        );

        const lastMessage = sortedArr[0];
        const updatedChats = [...chatsMetadata];
        if (isNewMessages) {
          const unreadMessages = updatedChats[index].unreadMessages;
          updatedChats[index] = {
            ...updatedChats[index],
            unreadMessages:
              messages[0].authorID !== user.id
                ? unreadMessages + messages.length
                : unreadMessages,
            lastMessage,
          };

          setChatsMetadata(updatedChats);
        }
      }
    },
    [chatsMetadata, selectedChat, user.id],
  );

  return (
    <ChatContext.Provider
      value={{
        chatsMetadata,
        setChatsMetadata,
        addMessages,
        selectedChat,
        setSelectedChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext<ChatContextValue>(ChatContext);

export default ChatProvider;
