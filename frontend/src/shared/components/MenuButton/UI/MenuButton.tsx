'use client';
import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
type Option = {
  name: string;
  onClick: () => void;
};
interface MenuButtonProps {
  options: Option[];
  icon: React.ReactNode;
}
export function MenuButton(props: MenuButtonProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <IconButton
        sx={{
          minWidth: '30px',
        }}
        disableRipple
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        {props.icon}
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {props.options.map((option) => (
          <MenuItem key={option.name} onClick={handleClose}>
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
