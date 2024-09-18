'use client';
import React, { useEffect, useMemo } from 'react';
import { ChatSlideWidget } from '@/features/chats/components/chatWidget/ui/ChatSlideWidget';
import { SelectChatWidget } from '@/features/chats/components/selectedChat/ui/SelectChatWidget';
import { CalendarProvider } from '@/features/calendar/ui/context/CalendarProvider';
import { useChatSocket } from '@/features/chats/context/ChatSocketContext';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/reduxHook';
import { selectChat } from '@/store/Slices/selectedChatSlice';
import { TaskType } from '@/entities/task/types/TaskType';

const SelectedChatPage = ({ params }: { params: { ChatID: string } }) => {
  const chatSocket = useChatSocket();
  const dispatch = useAppDispatch();
  const chats = useAppSelector((state) => state.chats.chats);
  const tasks = useAppSelector((state) => state.tasks.tasksForMe);
  const chatTasks: TaskType[] = useMemo(() => {
    return tasks.filter((task) => task.chatID === params.ChatID);
  }, [tasks, params.ChatID]);

  const chatTasksTodo: TaskType[] = chatTasks.filter(
    (task) => task.status !== 'verified',
  );

  useEffect(() => {
    const currentChat = chats.find((chat) => chat.id === params.ChatID);
    if (currentChat) {
      dispatch(
        selectChat({
          id: params.ChatID,
          name: currentChat.title,
          img: currentChat.img,
          isGroup: currentChat.isGroup,
          chatParticipants: currentChat.participants,
          messages: [],
          tasks: [],
        }),
      );
    }
    if (chatSocket?.socket && params.ChatID) {
      chatSocket.joinChat(params.ChatID);
    }
  }, [params.ChatID, chatSocket?.socket]);

  return (
    <CalendarProvider
      InitialTaskDates={chatTasksTodo.map((task) => task.deadline)}
    >
      <SelectChatWidget />
      <ChatSlideWidget />
    </CalendarProvider>
  );
};
export default SelectedChatPage;
