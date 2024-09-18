'use client';
import React from 'react';
import styles from './Layout.module.scss';
import { Container, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Logo } from '@/shared/components/Logo';
import { Link } from '@/navigation/navigation';
import { useTranslations } from 'next-intl';

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const t = useTranslations('Registration');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <Logo />
        </div>
        <Link href={'/login'}>{t('Login')}</Link>
      </header>
      <Container
        sx={{ gap: '30px', display: 'flex', flexDirection: 'column' }}
        maxWidth={'xl'}
      >
        <section className={styles.title}>
          <Typography
            fontWeight={'bold'}
            component={'h1'}
            variant={isSmallScreen ? 'h4' : 'h3'}
          >
            {t('Registration')}
          </Typography>
        </section>
        <section className={styles.content}>{children}</section>
      </Container>
    </div>
  );
};

export default ClientLayout;
