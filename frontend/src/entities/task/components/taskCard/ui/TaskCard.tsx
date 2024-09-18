'use client';
import styles from './TaskCard.module.scss';
import { User } from '@/entities/User';
import { CustomChip } from '@/shared/components/CustomChip';
import { Colors } from '@/styles/colors/colors';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SideWidget } from '@/shared/components/SideWidget';
import { Task } from '../../../ui/Task';
import { TaskType } from '@/entities/task/types/TaskType';
import { Deadline } from '@/entities/task/components/Deadline/Deadline';

export type TaskCardProps = {
  task: TaskType;
  size: 'normal' | 'small';
};

export const TaskCard: React.FC<TaskCardProps> = (props: TaskCardProps) => {
  const [openTask, setOpenTask] = useState<boolean>(false);
  const t = useTranslations('Task');
  const openTaskHandle = () => {
    setOpenTask(true);
  };
  return (
    <React.Fragment>
      <SideWidget setOpen={setOpenTask} open={openTask}>
        <Task task={props.task} setOpen={setOpenTask} />
      </SideWidget>

      <div
        onClick={openTaskHandle}
        className={`${styles.container} ${props.size === 'normal' ? styles.normal : styles.small}`}
      >
        <section className={styles.title}>
          <h5>{props.task.title}</h5>
        </section>
        {props.size === 'normal' && (
          <section className={styles.info}>
            <Deadline date={props.task.deadline} />
          </section>
        )}

        <section className={styles.status}>
          {props.size === 'normal' && (
            <h5
              style={{
                color: Colors.SURFACE,
                fontWeight: '300',
              }}
            >
              {t('From')}:
            </h5>
          )}
          {props.size === 'small' ? (
            <User size={'avatar'} user={props.task.createdBy} />
          ) : (
            <User size={'small'} user={props.task.createdBy} />
          )}

          <CustomChip
            status={props.task.status}
            text={t(props.task.status)}
            size={'small'}
          />
        </section>
      </div>
    </React.Fragment>
  );
};
