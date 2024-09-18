'use client'
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { AcceptedRequest, friendsRequest } from '@/providers/WebSocketContext';
interface NotificationContextProps {
	messageNumber: number
	friendRequests: friendsRequest[];
	acceptedRequest: AcceptedRequest | null;
	setAcceptedRequest:(request:AcceptedRequest|null)=>void;
	setMessageNumber: (messageNumber:number) => void;
	setFriendRequests:  (requests: friendsRequest[] | ((prevRequests: friendsRequest[]) => friendsRequest[])) => void;
}
interface NotificationProviderProps {
	children: ReactNode;
	initialRequests?:friendsRequest[]
	initialMessageNumber: number
}
const NotificationContext = createContext<NotificationContextProps>({
	acceptedRequest:null,
	friendRequests: [],
	messageNumber:0,
	setAcceptedRequest:() => {},
	setMessageNumber: () => {},
	setFriendRequests: () => {},
});

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children,initialRequests,initialMessageNumber }) => {
	const [messageNumber, setMessageNumber] = useState<number>(initialMessageNumber||0);
	const [acceptedRequest, setAcceptedRequest] = useState<AcceptedRequest|null>(null);
	const [friendRequests, setFriendRequests] = useState<friendsRequest[]>(initialRequests||[]);
	

	return (
		<NotificationContext.Provider value={{ acceptedRequest,setAcceptedRequest,messageNumber, friendRequests, setMessageNumber, setFriendRequests }}>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotifications = () => useContext(NotificationContext);
