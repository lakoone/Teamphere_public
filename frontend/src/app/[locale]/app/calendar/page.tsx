'use client';
import styles from './CalendarPage.module.scss';
import { Header } from '@/shared/components/Header';
import { CalendarWidget } from '@/features/calendar/ui/CalendarWidget';
import { useTranslations } from 'next-intl';
import { CalendarProvider } from '@/features/calendar/ui/context/CalendarProvider';
import { useAppSelector } from '@/utils/hooks/reduxHook';
import React from 'react';

const CalendarPage: React.FC = () => {
  const tasks = useAppSelector((state) => state.tasks.tasksForMe);
  const tasksToDo = tasks.filter(
    (task) => task.status !== 'verified' && task.status !== 'sent',
  );
  const t = useTranslations('CalendarPage');
  return (
    <div className={styles.container}>
      <Header>
        <h1>{t('Calendar')}</h1>
      </Header>
      <CalendarProvider
        InitialTaskDates={tasksToDo.map((task) => task.deadline)}
      >
        <CalendarWidget />
      </CalendarProvider>
    </div>
  );
};
export default CalendarPage;
