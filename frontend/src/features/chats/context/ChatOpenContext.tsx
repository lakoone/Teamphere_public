import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ChatOpenContextProps {
  isChatListOpen: boolean;
  isTaskWidgetOpen: boolean;
  toggleTaskWidget: () => void;
  toggleChatList: () => void;
  setIsChatListOpen: (prev: boolean) => void;
}
const defaultValue: ChatOpenContextProps = {
  isChatListOpen: false,
  isTaskWidgetOpen: false,
  toggleTaskWidget: () => {},
  toggleChatList: () => {},
  setIsChatListOpen: (prev: boolean) => {},
};
const ChatOpenContext = createContext<ChatOpenContextProps>(defaultValue);
export const useChatOpen = (): ChatOpenContextProps => {
  const context = useContext(ChatOpenContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
export const ChatOpenProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isChatListOpen, setIsChatListOpen] = useState<boolean>(false);
  const [isTaskWidgetOpen, setIsTaskWidgetOpen] = useState<boolean>(false);
  const toggleChatList = () => {
    setIsChatListOpen((prev) => !prev);
  };
  const toggleTaskWidget = () => {
    setIsTaskWidgetOpen((prev) => !prev);
  };
  return (
    <ChatOpenContext.Provider
      value={{
        setIsChatListOpen,
        toggleTaskWidget,
        isTaskWidgetOpen,
        toggleChatList,
        isChatListOpen,
      }}
    >
      {children}
    </ChatOpenContext.Provider>
  );
};
