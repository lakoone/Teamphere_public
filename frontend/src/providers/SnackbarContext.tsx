import React, { createContext, useContext, useState } from 'react';
import { SnackAlert } from '@/features/SnackAlert';

type SnackbarContextType = {
  showSnackbar: (
    alertText: string,
    type?: 'info' | 'success' | 'error',
  ) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
);

export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

export const SnackbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [alertText, setAlertText] = useState('');
  const [type, setType] = useState<'info' | 'success' | 'error'>('info');

  const showSnackbar = (text: string, type?: 'info' | 'success' | 'error') => {
    setAlertText(text);
    type && setType(type);
    setOpen(true);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <SnackAlert
        open={open}
        setOpen={setOpen}
        alertText={alertText}
        type={type}
      />
    </SnackbarContext.Provider>
  );
};
