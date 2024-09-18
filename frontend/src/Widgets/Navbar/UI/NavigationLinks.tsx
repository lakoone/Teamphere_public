import React from 'react';
import {
  Badge,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link } from '@/navigation/navigation';
import { useTranslations } from 'next-intl';
import HomeIcon from '@/shared/icons/HomeIcon';
import CalendarIcon from '@/shared/icons/CalendarIcon';
import MessageIcon from '@/shared/icons/MessageIcon';
import GroupIcon from '@/shared/icons/GroupIcon';
import { useAppSelector } from '@/utils/hooks/reduxHook';

const NavigationLinks = ({
  setOpenNavMenu,
}: {
  setOpenNavMenu: (prev: boolean) => void;
}) => {
  const t = useTranslations('Tooltips');
  const friendRequests = useAppSelector((state) => state.requests.requests);
  const messageNumber = useAppSelector(
    (state) => state.indicators.messageNumber,
  );
  const theme = useTheme();
  const isSmallSize = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Tooltip placement={'right'} title={t('Dashboard')}>
        <Link
          onClick={() => {
            setOpenNavMenu(false);
          }}
          style={{ display: 'flex', gap: 'var(--gap-small)' }}
          href={'/app/dashboard'}
        >
          <HomeIcon />
          {isSmallSize && <Typography>{t('Dashboard')}</Typography>}
        </Link>
      </Tooltip>
      <Tooltip placement={'right'} title={t('Calendar')}>
        <Link
          onClick={() => {
            setOpenNavMenu(false);
          }}
          style={{ display: 'flex', gap: 'var(--gap-small)' }}
          href={'/app/calendar'}
        >
          <CalendarIcon />
          {isSmallSize && <Typography>{t('Calendar')}</Typography>}
        </Link>
      </Tooltip>
      <Tooltip placement={'right'} title={t('Message')}>
        <Badge
          badgeContent={messageNumber}
          color={'primary'}
          variant={'standard'}
        >
          <Link
            onClick={() => {
              setOpenNavMenu(false);
            }}
            style={{ display: 'flex', gap: 'var(--gap-small)' }}
            href={'/app/message'}
          >
            <MessageIcon />
            {isSmallSize && <Typography>{t('Message')}</Typography>}
          </Link>
        </Badge>
      </Tooltip>
      <Tooltip placement={'right'} title={t('Friends')}>
        <Badge
          badgeContent={friendRequests.length}
          color={'primary'}
          variant={'standard'}
        >
          <Link
            onClick={() => {
              setOpenNavMenu(false);
            }}
            style={{ display: 'flex', gap: 'var(--gap-small)' }}
            href={'/app/friends'}
          >
            <GroupIcon />
            {isSmallSize && <Typography>{t('Friends')}</Typography>}
          </Link>
        </Badge>
      </Tooltip>
    </>
  );
};

export default NavigationLinks;
