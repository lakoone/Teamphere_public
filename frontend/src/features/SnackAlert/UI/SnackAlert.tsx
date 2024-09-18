import { Alert, Snackbar } from '@mui/material';
import React from 'react';

export type SnackAlertProps = {
  alertText: string;
  type?: 'info' | 'error' | 'success';
  open: boolean;
  setOpen: (isOpen: boolean) => void;
};

export const SnackAlert: React.FC<SnackAlertProps> = ({
  open,
  setOpen,
  alertText,
  type = 'info',
}) => {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={type} variant="filled">
        {alertText}
      </Alert>
    </Snackbar>
  );
};
