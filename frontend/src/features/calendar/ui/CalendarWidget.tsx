'use client';
import styles from './CalendarWidget.module.scss';
import { Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DatePicker } from '@/features/calendar/DatePicker';
import { getWeekFromDate } from '@/utils/helpers/getWeekFromDate';
import { TaskCard } from '@/entities/task/components/taskCard/ui/TaskCard';
import { Colors } from '@/styles/colors/colors';
import { useTranslations } from 'next-intl';
import { getDayOfWeek } from '@/utils/helpers/getDayofWeek';
import { useSelectedDate } from '@/features/calendar/ui/context/CalendarProvider';
import { useLocale } from 'use-intl';
import { useAppSelector } from '@/utils/hooks/reduxHook';
import dayjs from 'dayjs';

export const CalendarWidget: React.FC = () => {
  const t = useTranslations('CalendarPage');
  const DaysOfWeek = [t('1'), t('2'), t('3'), t('4'), t('5'), t('6'), t('7')];
  const [days, setDays] = useState<Date[] | undefined>();
  const { SelectedDate, setDay } = useSelectedDate();
  const tasksForMe = useAppSelector((state) => state.tasks.tasksForMe);
  const locale = useLocale();
  useEffect(() => {
    setDays(() => {
      return getWeekFromDate(
        SelectedDate ? SelectedDate : new Date(Date.now()),
        locale,
      );
    });
  }, [SelectedDate, locale]);
  return (
    <div className={styles.container}>
      <Paper
        sx={{
          overflow: 'hidden',
          width: '100%',
        }}
      >
        <div className={styles.top}>
          <DatePicker ValueHandler={setDay} />
        </div>
        <div className={styles.scroll}>
          <div className={styles.calendar}>
            {days?.map((day: Date) => (
              <div key={day.toString()} className={styles.day}>
                <div className={styles.dayHead}>
                  <h4
                    style={
                      (day.getDate() === SelectedDate.getDate() && {
                        color: Colors.MAINGREEN,
                      }) || { color: Colors.SURFACE }
                    }
                  >
                    {`${DaysOfWeek[locale !== 'en' ? getDayOfWeek(day) : day.getDay()]}`}
                  </h4>
                  <h4
                    style={
                      (day.getDate() === SelectedDate.getDate() && {
                        color: Colors.MAINGREEN,
                      }) || { color: Colors.SURFACE }
                    }
                  >{`${day.getDate().toString().padStart(2, '0')}.${(day.getMonth() + 1).toString().padStart(2, '0')}`}</h4>
                </div>
                <div className={styles.dayContent}>
                  {[...tasksForMe]
                    .sort((a, b) => {
                      return Date.parse(a.deadline) - Date.parse(b.deadline);
                    })
                    .map((task) => {
                      const taskDeadline = new Date(Date.parse(task.deadline));

                      if (dayjs(day).isSame(dayjs(taskDeadline), 'day'))
                        return (
                          <TaskCard key={task.id} size={'small'} task={task} />
                        );
                      else return;
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Paper>
    </div>
  );
};
