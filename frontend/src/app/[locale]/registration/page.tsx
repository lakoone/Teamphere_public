'use client';
import React from 'react';
import { StepWidget } from '@/features/Registration';
import { useTranslations } from 'next-intl';
import { useData } from '@/providers/RegistrationContext/DataProvider';
import { AnimatePresence } from 'framer-motion';
import { Step1, Step3, Step2, Step4, Step5 } from '@/features/Registration';

const Page = () => {
  const t = useTranslations('Registration');
  const context = useData();
  const steps = [
    <StepWidget StepForm={<Step1 />} key={1} num={1} title={t('Step1')} />,
    <StepWidget StepForm={<Step2 />} key={2} num={2} title={t('Step2')} />,
    <StepWidget StepForm={<Step3 />} key={3} num={3} title={t('Step3')} />,
    <StepWidget
      StepForm={<Step4 />}
      optional
      key={4}
      num={4}
      title={t('Step4')}
    />,
    <StepWidget
      StepForm={<Step5 />}
      optional
      key={5}
      num={5}
      title={t('Step5')}
    />,
  ];

  return (
    <AnimatePresence mode={'wait'}>
      {steps.find((step) => parseInt(step.key!) === context.step)}
    </AnimatePresence>
  );
};

export default Page;
