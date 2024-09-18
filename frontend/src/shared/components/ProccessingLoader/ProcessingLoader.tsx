'use client';
import styles from './ProcessingLoader.module.scss';
import Lottie from 'lottie-react';
import LoaderAnimation from '@/../public/animations/ProccessingDataAnimation.json';
import React from 'react';
import { Box } from '@mui/system';
import { BorderLinearProgress } from '@/shared/components/Taskbar';
import { Colors } from '@/styles/colors/colors';
import { Typography } from '@mui/material';
import { useTranslations } from 'next-intl';

interface LoaderProps {
  local?: boolean;
  loaded: number;
}
export const ProcessingLoader: React.FC<LoaderProps> = ({ loaded = 0 }) => {
  const t = useTranslations('ProcessingData');
  return (
    <Box className={styles.container}>
      <Box className={styles.content}>
        <Lottie autoplay={true} loop={true} animationData={LoaderAnimation} />
        <Typography variant={'h6'}>{t('Uploading')}</Typography>
        <BorderLinearProgress
          textColor={Colors.SURFACE}
          percent={true}
          total={100}
          completed={loaded}
        />
      </Box>
    </Box>
  );
};
