import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatType } from '@/features/chats/types/ChatType';
import { MessageDTO } from '@/entities/message/types';

type ReadMessagePayload = {
  userID: number;
  messageID: string;
};

const initialState: { selectedChat: ChatType } = {
  selectedChat: {
    id: '',
    messages: [],
    name: '',
    img: '',
    tasks: [],
    chatParticipants: [],
    isGroup: false,
  },
};

export const selectedChatSlice = createSlice({
  name: 'selectedChat',
  initialState,
  reducers: {
    selectChat: (state, action: PayloadAction<ChatType>) => {
      state.selectedChat = action.payload;
    },
    setMessages: (state, action: PayloadAction<MessageDTO[]>) => {
      state.selectedChat.messages = action.payload.map((message) => ({
        ...message,
        readers: message.readers.map((reader) => reader.userId),
      }));
    },
    addNewMessage: (state, action: PayloadAction<MessageDTO[]>) => {
      const arr = action.payload.map((message) => ({
        ...message,
        readers: message.readers.map((reader) => reader.userId),
      }));
      state.selectedChat.messages = [...arr, ...state.selectedChat.messages];
    },
    addLoadedMessage: (state, action: PayloadAction<MessageDTO[]>) => {
      const arr = action.payload.map((message) => ({
        ...message,
        readers: message.readers.map((reader) => reader.userId),
      }));
      state.selectedChat.messages = [...state.selectedChat.messages, ...arr];
    },
    markMessagesAsRead: (state, action: PayloadAction<ReadMessagePayload>) => {
      let lastReadMessageIndex = state.selectedChat.messages.findIndex(
        (message) =>
          message.readers.includes(Number(action.payload.userID)) &&
          message.authorID !== action.payload.userID,
      );
      if (lastReadMessageIndex === -1) {
        lastReadMessageIndex = state.selectedChat.messages.length - 1;
      }

      const messageIndex = state.selectedChat.messages.findIndex(
        (message) => message.id === action.payload.messageID,
      );

      if (messageIndex !== -1) {
        for (
          let i = Math.min(lastReadMessageIndex, messageIndex);
          i <= Math.max(lastReadMessageIndex, messageIndex);
          i++
        ) {
          if (
            !state.selectedChat.messages[i].readers.includes(
              action.payload.userID,
            )
          ) {
            state.selectedChat.messages[i].readers.push(action.payload.userID);
          }
        }
      }
    },
  },
});

export const {
  setMessages,
  markMessagesAsRead,
  selectChat,
  addNewMessage,
  addLoadedMessage,
} = selectedChatSlice.actions;
export default selectedChatSlice.reducer;
