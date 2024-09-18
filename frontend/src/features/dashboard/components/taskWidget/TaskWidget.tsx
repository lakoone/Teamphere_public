'use client';
import styles from './TaskWidget.module.scss';
import { ToggleButtons } from '@/shared/components/ToggleButtons';
import { Slider } from '@/shared/components/Slider';
import { TaskCard } from '@/entities/task/components/taskCard/ui/TaskCard';
import React, { useState } from 'react';
import { Colors } from '@/styles/colors/colors';
import { Widget } from '@/shared/components/Widget';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/utils/hooks/reduxHook';
import { useMediaQuery, useTheme } from '@mui/material';

export const TaskWidget: React.FC = () => {
  const tasks = useAppSelector((state) => state.tasks);
  const [mode, setMode] = useState<'Current' | 'Status'>('Current');
  const [taskView, setTaskView] = useState<'tasksForMe' | 'myTasks'>(
    'tasksForMe',
  );
  const t = useTranslations('Widgets');
  const t2 = useTranslations('Task');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const ChangeModeHandler = (currentMode: string) => {
    setMode(currentMode as 'Current' | 'Status');
  };
  const ChangeTaskView = (taskView: string) => {
    setTaskView(taskView as 'tasksForMe' | 'myTasks');
  };
  const tasksToShow =
    taskView === 'tasksForMe' ? tasks.tasksForMe : tasks.tasksCreatedByMe;
  return (
    <Widget title={t('Tasks')}>
      <div className={styles.top}>
        <ToggleButtons
          onChange={ChangeTaskView}
          defaultValue={'tasksForMe'}
          Options={[
            { value: 'tasksForMe', title: t2('TasksForMe') },
            { value: 'myTasks', title: t2('MyTasks') },
          ]}
        />
        <ToggleButtons
          onChange={ChangeModeHandler}
          defaultValue={'Current'}
          Options={[
            { value: 'Current', title: t('Current') },
            { value: 'Status', title: t('Status') },
          ]}
        />
      </div>
      {mode === 'Current' ? (
        <Slider
          columnWidth={isSmallScreen ? 230 : 320}
          style={{ paddingTop: '10px' }}
        >
          {tasksToShow.length > 0 &&
            [...tasksToShow]
              .sort((a, b) => {
                return Date.parse(a.deadline) - Date.parse(b.deadline);
              })
              .map((task) => (
                <TaskCard
                  task={task}
                  key={task.id}
                  size={isSmallScreen ? 'small' : 'normal'}
                />
              ))}
        </Slider>
      ) : (
        <div className={styles.table}>
          <h4>{t2('created')}</h4>
          <div className={styles.tableItem}>
            <Slider columnWidth={isSmallScreen ? 230 : 320}>
              {tasksToShow.length > 0 &&
                tasksToShow
                  .filter((task) => task.status === 'created')
                  .map((task) => (
                    <TaskCard
                      task={task}
                      key={task.id}
                      size={isSmallScreen ? 'small' : 'normal'}
                    />
                  ))}
            </Slider>
          </div>
          <h4 style={{ color: Colors.YELLOW }} className={styles.titlecolumn}>
            {t2('process')}
          </h4>
          <div className={styles.tableItem}>
            <Slider columnWidth={isSmallScreen ? 230 : 320}>
              {tasksToShow.length > 0 &&
                tasksToShow
                  .filter((task) => task.status === 'process')
                  .map((task) => (
                    <TaskCard
                      task={task}
                      key={task.id}
                      size={isSmallScreen ? 'small' : 'normal'}
                    />
                  ))}
            </Slider>
          </div>
          <h4 style={{ color: Colors.BLUE }} className={styles.titlecolumn}>
            {t2('sent')}
          </h4>
          <div className={styles.tableItem}>
            <Slider columnWidth={isSmallScreen ? 230 : 320}>
              {tasksToShow.length > 0 &&
                tasksToShow
                  .filter((task) => task.status === 'sent')
                  .map((task) => (
                    <TaskCard
                      task={task}
                      key={task.id}
                      size={isSmallScreen ? 'small' : 'normal'}
                    />
                  ))}
            </Slider>
          </div>
          <h4
            style={{ color: Colors.MAINGREEN }}
            className={styles.titlecolumn}
          >
            {t2('verified')}
          </h4>
          <div className={styles.tableItem}>
            <Slider columnWidth={isSmallScreen ? 230 : 320}>
              {tasksToShow.length > 0 &&
                tasksToShow
                  .filter((task) => task.status === 'verified')
                  .map((task) => (
                    <TaskCard
                      task={task}
                      key={task.id}
                      size={isSmallScreen ? 'small' : 'normal'}
                    />
                  ))}
            </Slider>
          </div>
        </div>
      )}
    </Widget>
  );
};
