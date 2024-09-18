import { Button } from '@mui/material';
import React from 'react';

export type MessageLinkProps = {
  link: string;
  disable: boolean;
  text: string;
};

export const MessageLink: React.FC<MessageLinkProps> = (
  props: MessageLinkProps,
) => {
  const clickhandler = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <Button
      sx={{ textTransform: 'none' }}
      disabled={props.disable}
      fullWidth
      disableRipple
      onClick={clickhandler}
      color={'info'}
      variant={'outlined'}
    >
      {props.text}
    </Button>
  );
};
