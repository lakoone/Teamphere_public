import React from 'react';
import { Tooltip, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Link } from '@/navigation/navigation';
import { useTranslations } from 'next-intl';
import { useAppSelector } from '@/utils/hooks/reduxHook';
import { UserAvatar } from '@/entities/User/components/UserAvatar/UserAvatar';

const ProfileSection = ({
  setOpenNavMenu,
}: {
  setOpenNavMenu: (prev: boolean) => void;
}) => {
  const t = useTranslations('Tooltips');
  const user = useAppSelector((state) => state.user);
  const theme = useTheme();
  const isSmallSize = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Tooltip placement={'right'} title={t('Profile')}>
      <Link
        onClick={() => {
          setOpenNavMenu(false);
        }}
        style={{
          alignItems: 'center',
          display: 'flex',
          gap: 'var(--gap-small)',
        }}
        href={'/app/profile'}
      >
        <UserAvatar
          name={user.profile.name}
          size={'small'}
          img={user.profile.img}
        />
        {isSmallSize && (
          <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {t('Profile')}
          </Typography>
        )}
      </Link>
    </Tooltip>
  );
};

export default ProfileSection;
