'use client';
import styles from './StepWidget.module.scss';
import { Step } from '@/shared/components/Step';
import { Line } from '@/shared/components/Line';
import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';
import { Colors } from '@/styles/colors/colors';
import { useTranslations } from 'next-intl';

export type StepWidgetProps = {
  title: string;
  optional?: boolean;
  num: number;
  StepForm: ReactNode;
};

export const StepWidget: React.FC<StepWidgetProps> = ({
  title,
  num,
  StepForm,
  optional = false,
}) => {
  const t = useTranslations('Registration');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <motion.div key={num} className={styles.container}>
      <motion.div
        className={styles.top}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut',
        }}
        exit={{
          opacity: 0,
          transition: {
            duration: 0.5,
            delay: 0,
            ease: 'easeInOut',
          },
        }}
      >
        <Step num={num} />
      </motion.div>
      <motion.div
        className={styles.middle}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          ease: 'easeInOut',
        }}
        exit={{
          opacity: 0,
          transition: {
            duration: 0.5,
            delay: 0,
            ease: 'easeInOut',
          },
        }}
      >
        <Line isVertical />
      </motion.div>
      <motion.div
        className={styles.stepContent}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.6,
          delay: 0.3,
          ease: 'easeInOut',
        }}
        exit={{
          opacity: 0,
          transition: {
            duration: 0.5,
            delay: 0,
            ease: 'easeInOut',
          },
        }}
      >
        <Typography
          sx={{
            textAlign: 'center',
            whiteSpace: 'break-spaces',
          }}
          fontWeight={'500'}
          variant={isSmallScreen ? 'h6' : 'h4'}
          component={'h2'}
        >
          {`${title} `}
          {optional && (
            <span
              style={{ color: Colors.SURFACE }}
            >{`(${t('Optional')})`}</span>
          )}
        </Typography>
        {StepForm}
      </motion.div>
    </motion.div>
  );
};
