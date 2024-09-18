import styles from './Task.module.scss';
import React from 'react';
import { TaskType } from '../types/TaskType';
import { useAppSelector } from '@/utils/hooks/reduxHook';
import { UserType } from '@/entities/User/types';
import { useTaskForm } from '@/entities/task/hooks/useTaskForm';
import TaskHeader from '@/entities/task/components/TaskHeader/TaskHeader';
import TaskContent from '@/entities/task/components/TaskContent/TaskContent';
import TaskFooter from '@/entities/task/components/TaskFooter/TaskFooter';
import { updateTask } from '@/entities/task/api/api';
import { useSnackbar } from '@/providers/SnackbarContext';
import { useTranslations } from 'next-intl';
import { Deadline } from '@/entities/task/components/Deadline/Deadline';
import { AxiosError } from 'axios';

export type TaskProps = {
  setOpen: (isOpen: boolean) => void;
  task: TaskType;
};

export const Task: React.FC<TaskProps> = ({ setOpen, task }) => {
  const user: UserType = useAppSelector((state) => state.user);
  const isAuthor = task.createdByID === user.id;
  const t = useTranslations('Task');
  const { showSnackbar } = useSnackbar();
  const { control, handleSubmit, setValue, watch, formState, onSubmit } =
    useTaskForm(task, async (data) => {
      try {
        await updateTask(task.id, data);
        showSnackbar(`${t('SuccessfullyUpdated')}`, 'success');
        setOpen(false);
      } catch (e) {
        if (e instanceof AxiosError && e.response) {
          showSnackbar(`${e.response.data.message}`, 'error');
          setOpen(false);
        } else {
          showSnackbar(`${e}`, 'error');
          setOpen(false);
        }
      }
    });

  return (
    <div className={styles.container}>
      <TaskHeader title={task.title} setOpen={setOpen} />
      <div className={styles.deadline}>
        <Deadline date={task.deadline} />
      </div>

      <TaskContent
        task={task}
        control={control}
        isAuthor={isAuthor}
        setValue={setValue}
        watch={watch}
      />

      <TaskFooter
        isAuthor={isAuthor}
        task={task}
        onStatusChange={(status) =>
          setValue('status', status, { shouldDirty: true })
        }
        formState={formState}
        handleSubmit={handleSubmit(onSubmit)}
      />
    </div>
  );
};
