'use client';
import styles from './Loader.module.scss';
import Lottie from 'lottie-react';
import LoaderAnimation from '@/../public/animations/loader.json';
import React from 'react';

interface LoaderProps {
  local?: boolean;
}
export const Loader: React.FC<LoaderProps> = ({ local = false }) => {
  return (
    <div className={`${local ? styles.local : styles.container}`}>
      <div className={styles.loader}>
        <Lottie autoplay={true} loop={true} animationData={LoaderAnimation} />
      </div>
    </div>
  );
};
