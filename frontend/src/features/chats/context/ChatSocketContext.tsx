'use client';
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import io, { Socket } from 'socket.io-client';
import { getCookie } from '@/utils/helpers/getCookie';
import { MessageDTO } from '@/entities/message/types';
import { CreateMessageType } from '@/entities/message/types/CreateMessageType';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/reduxHook';
import {
  addNewMessage,
  markMessagesAsRead,
  setMessages,
} from '@/store/Slices/selectedChatSlice';

const CHAT_SOCKET_URL = `${process.env.NEXT_PUBLIC_STATUS === 'prod' ? process.env.NEXT_PUBLIC_DOMAIN : 'http://localhost:5000'}/api/chat`;

interface ChatSocketContextProps {
  socket: Socket | null;
  sendMessage: (message: CreateMessageType) => void;
  joinChat: (chatId: string) => void;
  handleRead: (messageId: string) => void;
}
const defaultValue: ChatSocketContextProps = {
  socket: null,
  sendMessage: () => {},
  joinChat: () => {},
  handleRead: () => {},
};
const ChatSocketContext = createContext<ChatSocketContextProps>(defaultValue);

export const ChatSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const selectedChatID = useAppSelector(
    (state) => state.selectedChat.selectedChat.id,
  );
  const dispatch = useAppDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (selectedChatID) {
      const token = getCookie('access_token');
      const chatSocket = io(CHAT_SOCKET_URL, {
        query: { token },
        withCredentials: true,
        transports: ['websocket'],
      });
      setSocket(chatSocket);
      chatSocket.on('chatMessages', (messages: MessageDTO[]) => {
        dispatch(setMessages(messages));
      });
      chatSocket.on('newMessage', (message: MessageDTO) => {
        dispatch(addNewMessage([message]));
      });
      chatSocket.on(
        'newReader',
        (readerInfo: { messageID: string; readerID: string }) => {
          dispatch(
            markMessagesAsRead({
              messageID: readerInfo.messageID,
              userID: Number(readerInfo.readerID),
            }),
          );
        },
      );

      return () => {
        chatSocket.disconnect();
      };
    }
  }, [selectedChatID]);

  const sendMessage = (message: CreateMessageType) => {
    if (socket) {
      socket.emit('sendMessageFromClient', message);
    }
  };
  const handleRead = (messageId: string) => {
    if (socket) socket.emit('clientReadMessage', messageId);
  };

  const joinChat = useCallback(
    (chatId: string) => {
      if (socket) {
        socket.emit('joinChat', chatId);
      }
    },
    [socket],
  );

  return (
    <ChatSocketContext.Provider
      value={{ socket, sendMessage, handleRead, joinChat }}
    >
      {children}
    </ChatSocketContext.Provider>
  );
};

export const useChatSocket = () => useContext(ChatSocketContext);
