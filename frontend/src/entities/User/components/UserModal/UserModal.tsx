import React from 'react';
import { Modal } from '@mui/material';
import { ProfileCard } from '../ProfileCard';
import { UserType } from '@/entities/User/types';

type UserModalProps = {
  open: boolean;
  handleClose: (event: React.MouseEvent) => void;
  user: UserType;
};

export const UserModal: React.FC<UserModalProps> = ({
  open,
  handleClose,
  user,
}) => {
  return (
    <Modal
      onClick={(event) => event.stopPropagation()}
      open={open}
      onClose={handleClose}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ProfileCard user={user} handleClose={handleClose} />
    </Modal>
  );
};
