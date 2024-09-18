import { Tooltip } from '@mui/material';
import styles from '@/entities/task/components/taskCard/ui/TaskCard.module.scss';
import TimeIcon from '@/shared/icons/TimeIcon';
import { Colors } from '@/styles/colors/colors';
import { Time } from '@/shared/components/Time';
import React from 'react';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
interface DeadlineProps {
  date: string;
}
export const Deadline: React.FC<DeadlineProps> = ({ date }) => {
  const t = useTranslations('Task');
  const isExpired = dayjs(date).isBefore(dayjs());
  return (
    <Tooltip placement="right" title={isExpired ? t('expired') : t('Deadline')}>
      <div className={styles.deadline}>
        <TimeIcon color={isExpired ? Colors.SOFTRED : undefined} />
        <Time
          color={isExpired ? Colors.SOFTRED : undefined}
          size={'normal'}
          date={date}
          timeFormat={'dayHour'}
        />
      </div>
    </Tooltip>
  );
};
