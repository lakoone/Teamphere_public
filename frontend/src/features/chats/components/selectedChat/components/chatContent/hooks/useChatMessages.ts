import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/reduxHook';
import { throttle } from '@/utils/helpers/throttle';
import { fetchChatMessages } from '../api/api';
import { changeUnreadMessage } from '@/store/Slices/chatSlice';
import { decrementIndicator } from '@/store/Slices/indicatorSlice';
import { useChatSocket } from '@/features/chats/context/ChatSocketContext';
import { MessageType } from '@/entities/message/types';
import { addLoadedMessage } from '@/store/Slices/selectedChatSlice';

export const useChatMessages = (
  selectedChatId: string | number,
  chatRef: React.RefObject<HTMLDivElement>,
) => {
  const dispatch = useAppDispatch();
  const { handleRead } = useChatSocket();
  const chats = useAppSelector((state) => state.chats.chats);
  const messages = useAppSelector(
    (state) => state.selectedChat.selectedChat.messages,
  );
  const messagesRef = useRef(messages);
  const user = useAppSelector((state) => state.user);
  const [lockRequest, setLockRequest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const handleScroll = async () => {
    const chat = chatRef.current;
    if (chat) {
      const scrollDistance =
        Math.ceil(chat.scrollHeight - chat.scrollTop) - chat.clientHeight;
      const isUserAtBottom = -2 <= scrollDistance && scrollDistance <= 2;
      setIsAtBottom(isUserAtBottom);

      if (
        chat.scrollTop < 150 &&
        !isLoading &&
        !lockRequest &&
        messages.length
      ) {
        setIsLoading(true);
        if (typeof selectedChatId === 'string') {
          const previousScrollHeight = chat.scrollHeight;
          await loadMoreMessages(selectedChatId, messages);
          requestAnimationFrame(() => {
            const newScrollHeight = chat.scrollHeight;
            chat.scrollTop += newScrollHeight - previousScrollHeight;
          });
        }
      }

      const diff = chat.scrollHeight - chat.scrollTop - chat.clientHeight;
      if (diff < 200 && showScrollBtn) {
        setShowScrollBtn(false);
      } else if (diff > 200 && !showScrollBtn) {
        setShowScrollBtn(true);
      }
    }
  };

  const loadMoreMessages = async (chatID: string, messages: MessageType[]) => {
    if (lockRequest) return;
    try {
      const lastLoadedMessageDate = messages[messages.length - 1].createdAt;
      const response = await fetchChatMessages({
        chatID,
        lastLoadedMessageDate,
        take: 30,
      });
      const newMessages = response.data;

      if (newMessages.length === 0) {
        setLockRequest(true);
        return;
      }

      dispatch(addLoadedMessage(newMessages));
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0 && messages) {
        const visibleEntry = visibleEntries.find((entry) => {
          const messageString = entry.target.getAttribute('data-message');
          const message = JSON.parse(messageString || 'null');
          return (
            message &&
            message.authorID !== user.id &&
            !message.readers.includes(user.id)
          );
        });

        if (visibleEntry) {
          const messageString =
            visibleEntry.target.getAttribute('data-message');
          const message = JSON.parse(messageString!);
          const index = messagesRef.current.findIndex(
            (msg) => msg.id === message.messageID,
          );
          let count = 1;

          while (messages[index + count]) {
            if (!messages[index + count].readers.includes(user.id)) count++;
            else break;
          }

          const chat = chats.find((chat) => chat.id === selectedChatId);

          if (chat && chat.unreadMessages - count < 1) {
            dispatch(
              decrementIndicator({
                type: 'message',
                chatID: String(selectedChatId),
              }),
            );
          }
          dispatch(
            changeUnreadMessage({
              chatID: String(selectedChatId),
              addend: -count,
            }),
          );
          handleRead(message.messageID);
        }
      }
    },
    [handleRead, user.id, messages, selectedChatId, dispatch, chats],
  );

  const throttleMarkAsRead = useMemo(
    () => throttle(markAsRead, 2000, { disableLastCall: false }),
    [markAsRead],
  );

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  return {
    isLoading,
    isAtBottom,
    showScrollBtn,
    handleScroll,
    markAsRead,
    throttleMarkAsRead,
  };
};
