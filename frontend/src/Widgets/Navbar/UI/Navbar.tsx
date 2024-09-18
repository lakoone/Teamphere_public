'use client';
import React, { useState } from 'react';
import styles from './Navbar.module.scss';
import ProfileSection from './ProfileSection';
import NavigationLinks from './NavigationLinks';
import BottomSection from './BottomSection';
import { IconButton, useMediaQuery, useTheme } from '@mui/material';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';
import BurgerIcon from '@/shared/icons/BurgerIcon';

export const Navbar: React.FC = () => {
  const [openNavMenu, setOpenNavMenu] = useState(false);
  const theme = useTheme();
  const isSmallSize = useMediaQuery(theme.breakpoints.down('md'));
  const toggleMenu = () => {
    setOpenNavMenu((prev) => !prev);
  };

  return (
    <div className={`${styles.container} ${openNavMenu && styles.menu}`}>
      {isSmallSize && (
        <IconButton
          sx={{ marginLeft: 'auto', marginRight: '20px' }}
          onClick={() => toggleMenu()}
        >
          {openNavMenu ? <CloseIcon /> : <BurgerIcon />}
        </IconButton>
      )}
      {(!isSmallSize || openNavMenu) && (
        <div className={styles.alignContainer}>
          <ProfileSection setOpenNavMenu={setOpenNavMenu} />
          <NavigationLinks setOpenNavMenu={setOpenNavMenu} />
          <div className={styles.bottom}>
            <BottomSection />
          </div>
        </div>
      )}
    </div>
  );
};
