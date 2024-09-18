import React, { MouseEventHandler, useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { CustomChip, CustomChipProps } from '../CustomChip/UI/CustomChip';
import { useTranslations } from 'next-intl';
import { TaskType } from '@/entities/task/types/TaskType';

interface CustomChipWithOptionsProps
  extends Omit<CustomChipProps, 'onClick' | 'status' | 'text'> {
  options: Partial<TaskType['status']>[];
  onStatusChange?: (value: TaskType['status']) => void;
  status: TaskType['status'];
}

export const CustomChipWithOptions: React.FC<CustomChipWithOptionsProps> = ({
  size,
  status,
  maxWidth,
  options,
  onStatusChange,
  ...rest
}) => {
  const t = useTranslations('Task');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentStatus, setCurrentStatus] =
    useState<TaskType['status']>(status);

  const handleClick: MouseEventHandler<HTMLElement> = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (option: Partial<TaskType['status']>) => {
    setCurrentStatus(option);
    setAnchorEl(null);
    if (onStatusChange) {
      onStatusChange(option);
    }
  };

  return (
    <>
      <CustomChip
        text={t(currentStatus)}
        size={size}
        status={currentStatus}
        maxWidth={maxWidth}
        onClick={(event) => rest.clickable && handleClick(event)}
        {...rest}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        {options.map((option) => (
          <MenuItem
            disableTouchRipple
            sx={{ '&:hover': { backgroundColor: 'transparent' } }}
            key={option}
            onClick={() => handleOptionClick(option)}
          >
            <CustomChip
              onClick={handleClick}
              clickable={true}
              text={t(option)}
              size={'small'}
              status={option}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
