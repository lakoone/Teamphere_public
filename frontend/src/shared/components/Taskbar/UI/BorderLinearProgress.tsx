'use client';
import styles from './ProgressBar.module.scss';
import LinearProgress, {
  linearProgressClasses,
} from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { Colors } from '@/styles/colors/colors';
import { Tooltip, Typography } from '@mui/material';

export type BorderLinearProgressProps = {
  total: number;
  completed: number;
  NoText?: boolean;
  textColor?: string;
  percent?: boolean;
};

export const CustomLinearProgress = styled(LinearProgress)(() => ({
  height: 6,
  borderRadius: 5,

  width: '85%',
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: Colors.BACKGROUND,
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: Colors.MAINGREEN,
  },
}));
export const BorderLinearProgress: React.FC<BorderLinearProgressProps> = (
  props: BorderLinearProgressProps,
) => {
  const progress = parseInt(((props.completed / props.total) * 100).toFixed(0));
  return props.NoText ? (
    <Tooltip title={`${props.completed}/${props.total}`}>
      <div className={styles.container}>
        <CustomLinearProgress
          sx={{ flex: 1 }}
          variant="determinate"
          value={progress}
        />
        {!props.NoText && (
          <Typography
            color={props.textColor || Colors.WHITE}
            variant="caption"
            component={'span'}
          >
            {`${props.completed}/${props.total} ${props.percent ? '%' : ''}`}
          </Typography>
        )}
      </div>
    </Tooltip>
  ) : (
    <div className={styles.container}>
      <CustomLinearProgress
        sx={{ flex: 1 }}
        variant="determinate"
        value={progress}
      />
      {!props.NoText && (
        <Typography
          color={props.textColor || Colors.WHITE}
          variant="caption"
          component={'span'}
        >
          {`${props.completed}/${props.total} ${props.percent ? '%' : ''}`}
        </Typography>
      )}
    </div>
  );
};
