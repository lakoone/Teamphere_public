import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType, UserProfile } from '@/entities/User/types';
type PartialProfile = Partial<UserProfile>;
const initialState: UserType = {
  id: 0,
  profile: {
    name: '',
    bio: '',
    tag: '',
    tagColor: '#ffffff',
    img: '',
    isPhotoVisible: false,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateProfile: (state, action: PayloadAction<PartialProfile>) => {
      const profile = { ...state.profile, ...action.payload };
      state.profile = profile;
    },
    setUser: (state, action: PayloadAction<UserType>) => {
      state.profile = action.payload.profile;
      state.id = action.payload.id;
    },
    clearUser: (state) => {
      state.profile = initialState.profile;
      state.id = initialState.id;
    },
  },
});

export const { clearUser, updateProfile, setUser } = userSlice.actions;
export default userSlice.reducer;
