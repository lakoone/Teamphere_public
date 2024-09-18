import styles from './message.module.scss';
import { fileDTO } from '@/entities/file/types';
import React from 'react';
import Image from 'next/image';
import { FileChip } from '@/entities/file/ui/FileChip';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { useMessageFiles } from '@/shared/hooks/useFiles';
import DownloadIcon from '@/shared/icons/DownloadIcon';
import { downloadFile } from '@/utils/helpers/downloadFile';
import { useTranslations } from 'next-intl';

export type messageProps = {
  text: string;
  owner: boolean;
  files: fileDTO[];
  id: string;
};

export const Message: React.FC<messageProps> = (props: messageProps) => {
  const { imageFiles, documentFiles } = useMessageFiles(props.files);
  const t = useTranslations('ProcessingData');
  return (
    <div
      key={props.id}
      style={
        !props.files.length
          ? { alignItems: 'center' }
          : { alignItems: 'flex-start' }
      }
      className={`${styles.container} ${props.owner && styles.owner}`}
    >
      {!!props.text.length && (
        <Typography component={'span'} variant="body1">
          {props.text}
        </Typography>
      )}
      {imageFiles.length > 0 && (
        <div className={styles.images}>
          {imageFiles.map((img) => (
            <Tooltip
              sx={{ zIndex: 0 }}
              leaveDelay={200}
              PopperProps={{ style: { zIndex: 1 } }}
              placement={props.owner ? 'left' : 'right'}
              title={
                <Tooltip
                  sx={{ zIndex: 1 }}
                  placement={'top'}
                  title={t('DownloadFile')}
                >
                  <IconButton onClick={() => downloadFile(img)}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              }
            >
              <Image
                key={img.id}
                style={{
                  width: 'auto',
                  height: 'auto',
                  borderRadius: '10px',
                  objectFit: 'contain',
                }}
                height={imageFiles.length < 2 ? 300 : 200}
                width={imageFiles.length < 2 ? 300 : 200}
                src={img.url}
                alt={img.name}
              />
            </Tooltip>
          ))}
        </div>
      )}
      {documentFiles.length > 0 &&
        documentFiles.map((doc) => (
          <FileChip
            tooltipPosition={props.owner ? 'left' : 'right'}
            file={doc}
          />
        ))}
    </div>
  );
};
