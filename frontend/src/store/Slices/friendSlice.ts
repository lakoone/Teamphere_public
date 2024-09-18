import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType } from '@/entities/User/types';

const initialState: { friends: UserType[] } = {
  friends: [],
};

export const friendSlice = createSlice({
  name: 'friends',
  initialState,
  reducers: {
    setFriends: (state, action: PayloadAction<UserType[]>) => {
      state.friends = action.payload;
    },
    addFriends: (state, action: PayloadAction<UserType[]>) => {
      state.friends = [...state.friends, ...action.payload];
    },
    removeFriend: (state, action: PayloadAction<number>) => {
      state.friends = state.friends.filter(
        (friend) => friend.id !== action.payload,
      );
    },
  },
});

export const { setFriends, addFriends, removeFriend } = friendSlice.actions;
export default friendSlice.reducer;
