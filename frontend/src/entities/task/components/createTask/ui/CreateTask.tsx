import styles from './CreateTask.module.scss';
import React, { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Divider, IconButton, Typography } from '@mui/material';
import CloseWidgetIcon from '@/shared/icons/CloseWidgetIcon';

import { useSelectedDate } from '@/features/calendar/ui/context/CalendarProvider';

import { useCreateTaskForm } from '@/entities/task/components/createTask/hooks/useCreateTaskForm';
import { ProcessingLoader } from '@/shared/components/ProccessingLoader/ProcessingLoader';
import { ParticipantsSection } from '@/entities/task/components/createTask/components/ParticipantsSection';
import { DescriptionSection } from '@/entities/task/components/createTask/components/DescriptionSection';
import { FooterSection } from '@/entities/task/components/createTask/components/FooterSection';
import axios, { CancelTokenSource } from 'axios';

export type CreateTaskProps = {
  setOpen: (isOpen: boolean) => void;
};

export const CreateTask: React.FC<CreateTaskProps> = ({ setOpen }) => {
  const t = useTranslations('Task');
  const tProcess = useTranslations('ProcessingData');
  const [loaded, setLoaded] = useState(0);
  const [IsProcessing, setIsProcessing] = useState<boolean>(false);
  const { SelectedDate } = useSelectedDate();
  const cancelSource = useRef<CancelTokenSource>(axios.CancelToken.source());
  const {
    control,
    trigger,
    onSubmit,
    formState,
    handleSubmit,
    setValue,
    watch,
    getValues,
  } = useCreateTaskForm(
    SelectedDate,
    setOpen,
    setIsProcessing,
    setLoaded,
    cancelSource.current.token,
  );
  const responsible: number[] = watch('responsible');
  const files = watch('files');

  return IsProcessing ? (
    <>
      <ProcessingLoader loaded={loaded} />
      <Button
        color={'error'}
        onClick={() => {
          cancelSource.current.cancel();
          cancelSource.current = axios.CancelToken.source();
        }}
      >
        {tProcess('Cancel')}
      </Button>
    </>
  ) : (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.top}>
        <Typography fontWeight={'bold'} variant="h5">
          {t('TaskTitle')}
        </Typography>
        <IconButton onClick={() => setOpen(false)} disableTouchRipple>
          <CloseWidgetIcon />
        </IconButton>
      </div>
      <section className={styles.content}>
        <ParticipantsSection
          trigger={trigger}
          formState={formState}
          control={control}
          responsible={responsible}
          setValue={setValue}
        />
        <Divider flexItem />
        <DescriptionSection
          control={control}
          files={files}
          setValue={setValue}
        />
      </section>
      <FooterSection setValue={setValue} getValues={getValues} />
    </form>
  );
};
