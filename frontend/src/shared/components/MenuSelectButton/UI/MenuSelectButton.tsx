'use client';
import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { OverridableStringUnion } from '@mui/types';
import { ButtonPropsColorOverrides } from '@mui/material/Button/Button';
import { Tooltip } from '@mui/material';
import { usePathname, useRouter } from '@/navigation/navigation';
import { useLocale } from 'next-intl';
import { LocaleEnum } from '@/navigation/localeEnum';

interface MenuButtonProps {
  tooltip: string;
  color?: OverridableStringUnion<
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning',
    ButtonPropsColorOverrides
  >;

  options: LocaleEnum[];
}
export const MenuSelectButton: React.FC<MenuButtonProps> = (
  props: MenuButtonProps,
) => {
  const { color = 'inherit', options } = props;
  const locale = useLocale();
  const [selectedOption, setSelectedOption] = React.useState(
    LocaleEnum[locale as 'uk' | 'en' | 'pl'],
  );
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const pathname = usePathname();
  const router = useRouter();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Tooltip placement={'right'} title={props.tooltip}>
        <Button
          style={{ textTransform: 'none' }}
          size={'small'}
          color={color}
          disableRipple
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          {selectedOption}
        </Button>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={() => {
              handleClose();
              setSelectedOption(option);
              if (option !== selectedOption) {
                if (option === 'English')
                  router.replace(pathname, { locale: 'en' });
                else if (option === 'Українська')
                  router.replace(pathname, { locale: 'uk' });
                else router.replace(pathname, { locale: 'pl' });
              }
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
