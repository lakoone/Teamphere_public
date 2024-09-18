'use client';
import { Chip, Typography } from '@mui/material';
import React from 'react';
import { Header } from '@/shared/components/Header';
import { Colors } from '@/styles/colors/colors';
import { useAppSelector } from '@/utils/hooks/reduxHook';
import { useSnackbar } from '@/providers/SnackbarContext';
import { useTranslations } from 'next-intl';

export const ProfileHeader: React.FC = () => {
  const user = useAppSelector((state) => state.user);
  const t = useTranslations('ProfilePage');

  const { showSnackbar } = useSnackbar();

  const ChipHandleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    navigator.clipboard
      .writeText(target.innerText)
      .then(() => showSnackbar(`${t('IdCopied')}`, 'success'));
  };
  return (
    <Header>
      <h1>{t('Profile')}</h1>
      <Typography fontWeight={'bold'} color={Colors.SURFACE} variant="h5">
        ID
      </Typography>
      <Chip
        variant="outlined"
        sx={{
          fontSize: '16px',
          fontWeight: 'bold',
        }}
        size="medium"
        label={user.id}
        onClick={ChipHandleClick}
      />
    </Header>
  );
};
