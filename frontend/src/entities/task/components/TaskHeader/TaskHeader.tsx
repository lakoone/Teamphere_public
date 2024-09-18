import React from 'react';
import { Typography, IconButton } from '@mui/material';
import CloseWidgetIcon from '@/shared/icons/CloseWidgetIcon';
import styles from '../../ui/Task.module.scss';

type TaskHeaderProps = {
  title: string;
  setOpen: (isOpen: boolean) => void;
};

const TaskHeader: React.FC<TaskHeaderProps> = ({ title, setOpen }) => {
  return (
    <div className={styles.top}>
      <div className={styles.taskTitle}>
        <Typography
          sx={{ whiteSpace: 'pre-wrap' }}
          fontWeight={'bold'}
          variant="h6"
          component={'h2'}
        >
          {title}
        </Typography>
      </div>
      <IconButton onClick={() => setOpen(false)} disableTouchRipple>
        <CloseWidgetIcon />
      </IconButton>
    </div>
  );
};

export default TaskHeader;
