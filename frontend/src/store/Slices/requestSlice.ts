import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { friendsRequest } from '@/providers/WebSocketContext';

const initialState: { requests: friendsRequest[] } = {
  requests: [],
};
export const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    setRequests: (state, action: PayloadAction<friendsRequest[]>) => {
      state.requests = action.payload;
    },
    addRequests: (state, action: PayloadAction<friendsRequest[]>) => {
      const Arr = [...state.requests, ...action.payload];
      state.requests = Arr.reduce<friendsRequest[]>((accumulator, current) => {
        if (!accumulator.some((request) => request.id === current.id)) {
          accumulator.push(current);
        }
        return accumulator;
      }, []);
    },
    deleteRequest: (state, action: PayloadAction<number>) => {
      state.requests = state.requests.filter(
        (request) => request.id !== action.payload,
      );
    },
    clearRequests: (state) => {
      state.requests = [];
    },
  },
});

export const { setRequests, addRequests, deleteRequest, clearRequests } =
  requestSlice.actions;
export default requestSlice.reducer;
