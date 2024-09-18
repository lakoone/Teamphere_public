import styles from './Step.module.scss';
import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

export type StepProps = {
  num: number;
};

export const Step: React.FC<StepProps> = ({ num }) => {
  const t = useTranslations('Registration');
  return (
    <div className={styles.container}>
      <Typography
        fontWeight={'bold'}
        variant={'h4'}
        component={'span'}
      >{`${t('Step')} ${num}`}</Typography>
    </div>
  );
};
