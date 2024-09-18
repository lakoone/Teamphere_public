import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import LogoutIcon from '@/shared/icons/LogoutIcon';
import { MenuSelectButton } from '@/shared/components/MenuSelectButton';
import { useTranslations } from 'next-intl';
import { LocaleEnum } from '@/navigation/localeEnum';
import { useAppDispatch } from '@/utils/hooks/reduxHook';
import { clearUser } from '@/store/Slices/userSlice';
import styles from './Navbar.module.scss';
import { axiosInstance } from '@/utils/axios-config';
const BottomSection: React.FC = () => {
  const t = useTranslations('Tooltips');
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await axiosInstance.post('api/auth/logout', {}, { withCredentials: true });

    dispatch(clearUser());
    window.location.href = '/login';
  };

  return (
    <div className={styles.bottom}>
      <Tooltip onClick={handleLogout} placement={'right'} title={t('Logout')}>
        <IconButton>
          <LogoutIcon />
        </IconButton>
      </Tooltip>
      <MenuSelectButton
        tooltip={t('Language')}
        color={'info'}
        options={[LocaleEnum.uk, LocaleEnum.en, LocaleEnum.pl]}
      />
      <h5>Version 1.0.0</h5>
    </div>
  );
};

export default BottomSection;
