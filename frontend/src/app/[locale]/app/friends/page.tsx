'use client';
import styles from './FriendsPage.module.scss';
import { FriendsContent } from '@/features/friends/ui/FriendsContent';
import { Header } from '@/shared/components/Header';
import React from 'react';
import { useTranslations } from 'next-intl';

const FriendsPage = () => {
  const t = useTranslations('FriendsPage');
  return (
    <div className={styles.container}>
      <Header>
        <h1>{t('Friends')}</h1>
      </Header>
      <FriendsContent />
    </div>
  );
};
export default FriendsPage;
