import React, {ReactNode} from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface DialogProps {
  title: string;
  description: string;
  handleClose: () => void;
  open: boolean;
  content: ReactNode;
  actions: ReactNode;
}

export function DialogBackdrop(props: DialogProps) {
  const { handleClose, open} = props;
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={'xs'}
        PaperProps={{
          component: 'form',
          sx: {backgroundImage:'var(--on-surface)',

          },
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleClose();
          },
        }}
      >
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent >
          <DialogContentText>
            {props.description}
          </DialogContentText>
          {props.content}

        </DialogContent>
        <DialogActions>
          {props.actions}
        </DialogActions>
      </Dialog>
    </>
  );
}