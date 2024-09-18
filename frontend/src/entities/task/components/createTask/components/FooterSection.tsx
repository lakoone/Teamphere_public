import React from 'react';
import styles from '@/entities/task/components/createTask/ui/CreateTask.module.scss';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import Button from '@mui/material/Button';
import { useLocale, useTranslations } from 'next-intl';
import { UseFormGetValues, UseFormSetValue } from 'react-hook-form';
import { CreateTaskForm } from '@/entities/task/types/TaskType';

interface FooterSectionProps {
  setValue: UseFormSetValue<CreateTaskForm>;
  getValues: UseFormGetValues<CreateTaskForm>;
}
export const FooterSection: React.FC<FooterSectionProps> = ({
  setValue,
  getValues,
}) => {
  const locale = useLocale();
  const t = useTranslations('Task');
  return (
    <div className={styles.bottom}>
      <h5>{t('Deadline')} :</h5>
      <div className={styles.lastAction}>
        <LocalizationProvider adapterLocale={locale} dateAdapter={AdapterDayjs}>
          <MobileTimePicker
            onChange={(value) => {
              if (value) setValue('deadline', value.toDate());
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
              },
            }}
            defaultValue={dayjs(getValues('deadline'))}
          />
        </LocalizationProvider>
        <div>
          <Button type={'submit'}>{t('Create')}</Button>
        </div>
      </div>
    </div>
  );
};
