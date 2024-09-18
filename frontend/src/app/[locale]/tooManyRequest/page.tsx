'use client';
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { Button, Paper, Typography } from '@mui/material';
import { useTranslations } from 'next-intl';
import Lottie from 'lottie-react';
import Animation from '@/../public/animations/CalmAnimation.json';

const Page = () => {
  const t = useTranslations('TooManyRequests');
  const [seconds, setSeconds] = useState(60);
  useEffect(() => {
    const secondInterval = setInterval(
      () => setSeconds((prev) => prev - 1),
      1000,
    );
    return () => clearInterval(secondInterval);
  }, []);
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Lottie animationData={Animation} />
      <Paper
        sx={{
          width: 'fit-content',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          sx={{
            whiteSpace: 'break-spaces',
            textOverflow: 'inherit',
            wordBreak: 'break-word',
          }}
          variant={'h5'}
        >
          {t('TooManyRequests')}
        </Typography>
      </Paper>

      <Button
        disabled={seconds > 0}
        sx={{ position: 'fixed', right: '20px', top: '20px' }}
        onClick={() => {
          window.location.href = `/app/dashboard`;
        }}
      >
        {` Try again ${seconds > 0 ? seconds : ''}`}
      </Button>
    </Box>
  );
};

export default Page;
