import React from 'react';
import { Button } from '@mui/material';
import { Time } from '@/shared/components/Time';
import { TaskType } from '@/entities/task/types/TaskType';
import styles from '../../ui/Task.module.scss';
import { useTranslations } from 'next-intl';
import { User } from '@/entities/User';
import { CustomChipWithOptions } from '@/shared/components/ChipMenu/ChipMenu';
import { UseFormHandleSubmit } from 'react-hook-form';
import { taskStatus } from '@/entities/task/types/TaskType';

type TaskFooterProps = {
  isAuthor: boolean;
  task: TaskType;
  onStatusChange: (value: TaskType['status']) => void;
  formState: any;
  handleSubmit: ReturnType<UseFormHandleSubmit<any>>;
};

const TaskFooter: React.FC<TaskFooterProps> = ({
  isAuthor,
  task,
  formState,
  onStatusChange,
  handleSubmit,
}) => {
  const t = useTranslations('Task');
  const t2 = useTranslations('Buttons');

  const changedBy =
    task.usersAssigned.find((user) => user.user.id === task.changedByID)
      ?.user || task.createdBy;
  const allowedStatus: taskStatus[] = isAuthor
    ? (['verified', 'process'].filter(
        (status) => status !== task.status,
      ) as taskStatus[])
    : (['process', 'sent'].filter(
        (status) => status !== task.status,
      ) as taskStatus[]);
  return (
    <div className={styles.bottom}>
      <div className={styles.bottomHeader}>
        <h5>{t('LastAction')} :</h5>
        {formState.isDirty && (
          <Button sx={{ marginLeft: 'auto' }} onClick={handleSubmit}>
            {t2('Save')}
          </Button>
        )}
      </div>
      <div className={styles.lastAction}>
        <CustomChipWithOptions
          clickable={
            isAuthor ? task.status !== 'verified' : task.status !== 'sent'
          }
          size={'small'}
          onStatusChange={(status) => onStatusChange(status)}
          status={task.status}
          options={allowedStatus}
        />
        <Time size={'small'} date={task.lastChangedAt} timeFormat={'dayHour'} />
        {task.changedByID && <User size={'small'} user={changedBy} />}
      </div>
    </div>
  );
};

export default TaskFooter;
