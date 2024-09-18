import { createSlice, PayloadAction } from '@reduxjs/toolkit';
type Indicators = { type: 'request' | 'message' | 'task'; chatID?: string };
type IndicatorsType = {
  requestNumber: number;
  messageNumber: number;
  taskNumber: number;
  chatsWithNewMessages: string[];
};
const initialState = {
  requestNumber: 0,
  messageNumber: 0,
  taskNumber: 0,
  chatsWithNewMessages: [''],
};

export const indicatorSlice = createSlice({
  name: 'indicators',
  initialState,
  reducers: {
    setIndicators: (state, action: PayloadAction<IndicatorsType>) => {
      state.requestNumber = action.payload.requestNumber;
      state.taskNumber = action.payload.taskNumber;
      state.messageNumber = action.payload.messageNumber;
      state.chatsWithNewMessages = action.payload.chatsWithNewMessages;
    },
    incrementIndicator: (state, action: PayloadAction<Indicators>) => {
      switch (action.payload.type) {
        case 'message': {
          if (
            action.payload.chatID &&
            !state.chatsWithNewMessages.includes(action.payload.chatID)
          ) {
            state.chatsWithNewMessages = [
              ...state.chatsWithNewMessages,
              action.payload.chatID,
            ];

            state.messageNumber = state.messageNumber + 1;
          }
          break;
        }

        case 'task':
          state.taskNumber += 1;
          break;
        case 'request':
          state.requestNumber += 1;
          break;
      }
    },
    decrementIndicator: (state, action: PayloadAction<Indicators>) => {
      switch (action.payload.type) {
        case 'message': {
          if (action.payload.chatID) {
            if (
              state.chatsWithNewMessages.length > 0 &&
              state.chatsWithNewMessages.includes(action.payload.chatID)
            ) {
              state.chatsWithNewMessages = state.chatsWithNewMessages.filter(
                (item) => item !== action.payload.chatID,
              );

              state.messageNumber = state.messageNumber - 1;
            }
          }

          break;
        }
        case 'task':
          if (state.taskNumber > 0) state.taskNumber -= 1;
          break;
        case 'request':
          if (state.requestNumber > 0) state.requestNumber -= 1;
          break;
      }
    },
  },
});

export const { incrementIndicator, setIndicators, decrementIndicator } =
  indicatorSlice.actions;
export default indicatorSlice.reducer;
