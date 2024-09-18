
import { configureStore } from '@reduxjs/toolkit'
import {
	chatReducer,
	friendReducer,
	indicatorReducer,
	requestReducer,
	selectedChatReducer,
	taskReducer,
	userReducer,
} from '@/store/Slices';



export const store = configureStore({
		reducer: {
			user: userReducer,
			friends: friendReducer,
			indicators: indicatorReducer,
			requests: requestReducer,
			tasks:taskReducer,
			chats:chatReducer,
			selectedChat:selectedChatReducer
		}
	});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch