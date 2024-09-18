'use client';
import styles from './Logo.module.scss';
import { useMediaQuery, useTheme } from '@mui/material';
interface LogoProps {
  isAdaptive?: boolean;
}
export const Logo: React.FC<LogoProps> = ({ isAdaptive = true }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <div className={styles.container}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={isSmallScreen ? '47' : '67'}
        height={isSmallScreen ? '47' : '67'}
        fill="none"
        viewBox="0 0 67 67"
      >
        <rect
          width="22.648"
          height="22.648"
          x="17"
          y="16.015"
          fill="#20AC47"
          rx="3"
          transform="rotate(-45 17 16.015)"
        ></rect>
        <rect
          width="22.648"
          height="22.648"
          x="17"
          y="50.015"
          fill="#3AE66A"
          rx="3"
          transform="rotate(-45 17 50.015)"
        ></rect>
        <rect
          width="22.648"
          height="22.648"
          x="34"
          y="33.015"
          fill="#24A247"
          rx="3"
          transform="rotate(-45 34 33.015)"
        ></rect>
        <path
          fill="#2FCD5B"
          d="M2.121 35.121a3 3 0 010-4.242L13.88 19.12a3 3 0 014.242 0L29.88 30.88a3 3 0 010 4.242L18.12 46.88a3 3 0 01-4.242 0L2.12 35.12z"
        ></path>
        <path
          fill="#0D852E"
          d="M25.121 35.371a3 3 0 010-4.242l6.008-6.008a3 3 0 014.242 0l6.008 6.008a3 3 0 010 4.242L35.37 41.38a3 3 0 01-4.242 0L25.12 35.37z"
        ></path>
        <path
          fill="#73FF9A"
          d="M28.414 34.602a2 2 0 010-2.829l3.36-3.359a2 2 0 012.828 0l3.359 3.36a2 2 0 010 2.828L34.6 37.96a2 2 0 01-2.828 0l-3.359-3.36z"
        ></path>
      </svg>
      {isAdaptive ? !isSmallScreen && <h1>Teamphere</h1> : <h1>Teamphere</h1>}
    </div>
  );
};
