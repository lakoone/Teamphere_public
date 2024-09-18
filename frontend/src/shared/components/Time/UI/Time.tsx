'use client';
import styles from './Time.module.scss';
import React, { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

export type TimeProps = {
  color?: string;
  date: string;
  timeFormat: 'dayHour' | 'pastFrom' | 'time' | 'day';
  size: 'small' | 'normal' | 'large';
};

enum YearSeason {
  'Jan' = 0,
  'Feb' = 1,
  'Mar' = 2,
  'Apr' = 3,
  'May' = 4,
  'Jun' = 5,
  'Jul' = 6,
  'Aug' = 7,
  'Sep' = 8,
  'Oct' = 9,
  'Nov' = 10,
  'Dec' = 11,
}
type MonthKey = keyof typeof YearSeason;
export const Time: React.FC<TimeProps> = (props: TimeProps) => {
  const locale = useLocale();
  const date = new Date(Date.parse(props.date));
  const t = useTranslations('Time');
  const [time, setTime] = useState<string>();
  const style = {
    whiteSpace: 'nowrap',
    color: props.color || '#858585',
    fontSize: '12px',
    fontWeight: 'normal',
  };
  if (props.size === 'normal') {
    style.fontSize = '16px';
  } else if (props.size === 'large') {
    style.fontSize = '20px';
  }
  const timeFormatter = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const propsDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    let dateString: string;
    if (propsDate.getDate() === today.getDate()) {
      dateString = t('Today');
    } else if (propsDate.getDate() === yesterday.getDate()) {
      dateString = t('Yesterday');
    } else {
      const day = date.getDate().toString().padStart(2, '0');
      const month: MonthKey = YearSeason[date.getMonth()] as MonthKey;
      if (locale === 'en') dateString = `${t(month)} ${day} `;
      else dateString = `${day} ${t(month)}`;
    }

    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    if (props.timeFormat === 'dayHour')
      return `${dateString} | ${hour}:${minute}`;
    else if (props.timeFormat === 'day') return dateString;
    else return `${hour}:${minute}`;
  };
  const pastTimeFormatter = () => {
    const now = new Date();
    const diff = now.getTime() - date.getTime(); // ms
    const diffMinutes = diff / (1000 * 60);
    const diffHours = diff / (1000 * 60 * 60);
    const diffDays = diff / (1000 * 60 * 60 * 24);
    if (diff < 60000) {
      // < 60s
      return t('Now');
    } else if (diffMinutes < 60) {
      // < 60m
      return `${Math.floor(diffMinutes)} ${t('MinAgo')}`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)} ${t('HoursAgo')}`;
    } else if (diffDays < 2) {
      return ` ${t('Yesterday')}`;
    } else {
      return `${Math.floor(diffDays)} ${t('DaysAgo')}`;
    }
  };
  const calculateTime = () => {
    if (
      props.timeFormat === 'dayHour' ||
      props.timeFormat === 'time' ||
      props.timeFormat === 'day'
    ) {
      return timeFormatter();
    } else {
      return pastTimeFormatter();
    }
  };
  useEffect(() => {
    setTime(calculateTime());
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    if (props.timeFormat === 'pastFrom' && diffHours < 24) {
      const intervalId = setInterval(() => setTime(pastTimeFormatter()), 60000);

      return () => clearInterval(intervalId);
    }
  }, [props.date]);

  return (
    <p style={style} className={styles.container}>
      {time}
    </p>
  );
};
