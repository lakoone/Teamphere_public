import { Chip, ChipProps } from '@mui/material';
import { Colors } from '@/styles/colors/colors';
import { TaskType } from '@/entities/task/types/TaskType';

export interface CustomChipProps extends Omit<ChipProps, 'status'> {
  maxWidth?: string;
  text: string;
  size: 'small' | 'medium';
  status: TaskType['status'] | 'dark' | 'info';
}

const statusColor = {
  dark: {
    text: Colors.SURFACE,
    background: Colors.BACKGROUND,
    hovered: Colors.SECONDARY,
  },
  info: {
    text: Colors.WHITE,
    background: Colors.SECONDARY,
    hovered: Colors.BACKGROUND,
  },
  verified: {
    text: Colors.GREEN,
    background: Colors.GREENOPACITY,
    hovered: Colors.HOVERGREENOPACITY,
  },
  process: {
    text: Colors.YELLOW,
    background: Colors.YELLOWOPACITY,
    hovered: Colors.HOVERYELLOWOPACITY,
  },
  expired: {
    text: Colors.RED,
    background: Colors.REDOPACITY,
    hovered: Colors.HOVERREDOPACITY,
  },
  sent: {
    text: Colors.BLUE,
    background: Colors.BLUEOPACITY,
    hovered: Colors.HOVERBLUEOPACITY,
  },
  created: {
    text: Colors.WHITE,
    background: Colors.WHITEOPACITY,
    hovered: Colors.HOVERWHITEOPACITY,
  },
};

export const CustomChip: React.FC<CustomChipProps> = (
  props: CustomChipProps,
) => {
  const { text, size, status, maxWidth, ...rest } = props;
  return (
    <Chip
      sx={{
        '&:hover': { backgroundColor: statusColor[status].hovered },
        maxWidth: maxWidth || '200px',
        border: `${statusColor[status].text} 1px solid`,
        backgroundImage: 'none',
        backgroundColor: statusColor[status].background,
        borderRadius: '8px',
        color: statusColor[status].text,
      }}
      label={text}
      variant="filled"
      size={size}
      {...rest}
    ></Chip>
  );
};
