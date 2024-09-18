import { Drawer } from '@mui/material';
import React, { useEffect } from 'react';

export type WidgetProps = {
  children: React.ReactNode;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
};

export const SideWidget: React.FC<WidgetProps> = ({
  children,
  open,
  setOpen,
}) => {
  useEffect(() => {
    setOpen(open);
  }, [open]);
  const toggleWidget = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };
  return (
    <Drawer
      PaperProps={{
        sx: {
          padding: '25px',
          borderTopRightRadius: '0px',
          borderBottomRightRadius: '0px',
          borderTopLeftRadius: '45px',
          borderBottomLeftRadius: '45px',
          width: 'clamp(250px, 100%, 500px)',
          maxWidth: '500px',
        },
      }}
      anchor={'right'}
      open={open}
      onClose={toggleWidget(false)}
    >
      {children}
    </Drawer>
  );
};
