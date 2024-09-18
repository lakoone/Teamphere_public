import styles from './File.module.scss';
import React from 'react';
import {
  Divider,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { fileDTO } from '@/entities/file/types';
import { Colors } from '@/styles/colors/colors';
import FileIcon from '@/shared/icons/FileIcon';
import convertFileSize from '@/utils/helpers/convertFileSize';
import { downloadFile } from '@/utils/helpers/downloadFile';
import DownloadIcon from '@/shared/icons/DownloadIcon';
import { useTranslations } from 'next-intl';

type FileProps = {
  file: fileDTO;
  tooltipPosition?: 'left' | 'right' | 'top' | 'bottom';
};

export const FileChip: React.FC<FileProps> = (props: FileProps) => {
  const t = useTranslations('ProcessingData');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const handleDownload = async () => {
    await downloadFile(props.file);
  };
  return (
    <Tooltip
      leaveDelay={200}
      placement={props.tooltipPosition || 'top'}
      title={
        <Tooltip
          disableFocusListener
          disableTouchListener
          placement={'top'}
          title={t('DownloadFile')}
        >
          <IconButton onClick={() => handleDownload()}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      }
    >
      <div
        onClick={() => isSmallScreen && handleDownload()}
        className={styles.container}
      >
        <FileIcon />
        <Typography
          sx={{
            position: 'relative',
            display: 'inline-block',
            maxWidth: '500px',
            minWidth: '0px',
            overflow: 'hidden',
            padding: 0,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
          variant={'body1'}
          color={Colors.WHITE}
          component={'span'}
        >
          {props.file.name}
        </Typography>
        <Divider
          sx={{ border: 'none', width: '2px', borderRadius: '1px' }}
          color={Colors.SECONDARY}
          flexItem={true}
          orientation={'horizontal'}
        />
        <div className={styles.sizeBlock}>
          <Typography
            variant="caption"
            color={Colors.SURFACE}
            component={'span'}
          >
            {convertFileSize(props.file.size)}
          </Typography>
        </div>
      </div>
    </Tooltip>
  );
};
