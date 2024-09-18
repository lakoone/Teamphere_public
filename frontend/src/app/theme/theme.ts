import { ThemeOptions } from '@mui/material';
import '@/app/[locale]/globals.scss';
import '../../styles/fonts/Mariupol/stylesheet.css';
import localFont from 'next/font/local';
import { Colors } from '@/styles/colors/colors';

const mariupol = localFont({
  src: [
    {
      path: '../../styles/fonts/Mariupol/Mariupol-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../styles/fonts/Mariupol/Mariupol-Regular.woff2',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: '../../styles/fonts/Mariupol/Mariupol-Bold.woff2',
      weight: 'bold',
      style: 'normal',
    },
  ],
});

export const Theme: ThemeOptions = {
  typography: {
    fontFamily: mariupol.style.fontFamily,
  },
  breakpoints: {
    values: {
      md: 700,
      sm: 600,
      xs: 0,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {
    MuiCheckbox: {
      styleOverrides: {
        colorSecondary: Colors.SECONDARY,
      },
    },
    MuiFab: {
      defaultProps: {
        disableTouchRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: '20px',
          minWidth: '100px',
          position: 'fixed',
          bottom: '35px',
          right: '42px',
        },
      },
    },
    MuiFilledInput: {
      defaultProps: {
        disableUnderline: true,
      },
      styleOverrides: {
        root: {
          borderRadius: '10px',
        },
      },
    },
    MuiBackdrop: {
      defaultProps: {
        transitionDuration: 500,
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        grouped: {
          textTransform: 'none',
          padding: '4px 10px',
          color: 'var(--surface-color)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        elevation: {
          backgroundImage: 'none',
          backgroundColor: '#1A1A1A',
          borderRadius: '20px',
          padding: '20px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        label: {
          fontWeight: '500',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'none',
          backgroundColor: '#282828',
        },
      },
    },
    MuiAvatarGroup: {
      styleOverrides: {
        avatar: {
          backgroundColor: '#282828',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        colorDefault: {
          borderColor: 'white',
          backgroundColor: '#282828',
          color: 'white',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          padding: '0px',
          backgroundColor: '#282828',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          justifyContent: 'center',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#282828',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          '::-webkit-autofill': {
            transition: 'background-color 5000000s ease-in-out 0s',
          },
        },
      },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#7ad9a5',
    },
    secondary: {
      main: '#282828',
    },
    background: {
      default: '#121212',
      paper: '#282828',
    },
    text: {
      primary: '#F7F7F8',
      secondary: '#858585',
      disabled: '#858585',
    },
    info: {
      main: '#F7F7F8',
    },
    success: {
      main: '#2aa615',
    },
  },
  shape: {
    borderRadius: 10,
  },
};
