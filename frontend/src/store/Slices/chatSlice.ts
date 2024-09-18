import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatMetadata } from '@/features/chats/types/ChatMetadata';
import { MessageType } from '@/entities/message/types';

type UpdateChatMetadata = {
  id: string;
  data: Partial<ChatMetadata>;
};
type updateLastMessage = {
  isAuthor: boolean;
  lastMessage: MessageType;
};

const initialState: { chats: ChatMetadata[] } = {
  chats: [],
};

export const chatSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addNewChat: (state, action: PayloadAction<ChatMetadata>) => {
      state.chats = [...state.chats, action.payload];
    },
    setChatMetadata: (state, action: PayloadAction<ChatMetadata[]>) => {
      if (state.chats.length === 0) state.chats = action.payload;
    },
    updateChatMetadata: (state, action: PayloadAction<UpdateChatMetadata>) => {
      const index = state.chats.findIndex(
        (chat) => chat.id === action.payload.id,
      );
      if (index !== -1) {
        state.chats[index] = { ...state.chats[index], ...action.payload.data };
      }
    },
    newLastMessage: (state, action: PayloadAction<updateLastMessage>) => {
      const index = state.chats.findIndex(
        (chat) => chat.id === action.payload.lastMessage.chatID,
      );

      if (index !== -1) {
        state.chats[index] = {
          ...state.chats[index],
          lastMessage: action.payload.lastMessage,
          unreadMessages: !action.payload.isAuthor
            ? state.chats[index].unreadMessages + 1
            : state.chats[index].unreadMessages,
        };
      }
    },
    changeUnreadMessage: (
      state,
      action: PayloadAction<{ chatID: string; addend: number }>,
    ) => {
      const index = state.chats.findIndex(
        (chat) => chat.id === action.payload.chatID,
      );
      if (index !== -1) {
        const diff = state.chats[index].unreadMessages + action.payload.addend;
        state.chats[index].unreadMessages = diff < 0 ? 0 : diff;
      }
    },
  },
});

export const {
  updateChatMetadata,
  addNewChat,
  newLastMessage,
  setChatMetadata,
  changeUnreadMessage,
} = chatSlice.actions;
export default chatSlice.reducer;
