'use client';
import styles from './DropzoneFileInput.module.scss';
import { useDropzone } from 'react-dropzone';
import { useTranslations } from 'next-intl';
import { Typography } from '@mui/material';
import React, { useState } from 'react';

interface DropzoneFileInputProps {
  handleInputChange: (file: File) => void;
}

export const DropzoneFileInput: React.FC<DropzoneFileInputProps> = (
  props: DropzoneFileInputProps,
) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const t = useTranslations('Buttons');
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg'],
    },

    onDragOver: () => {
      setIsActive(true);
    },
    onDragLeave: () => {
      setIsActive(false);
    },

    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        props.handleInputChange(acceptedFiles[0]);
      }
      setIsActive(false);
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`${styles.dropzone} ${isActive && styles.onDrop}`}
    >
      <input {...getInputProps()} />
      <Typography
        sx={{
          userSelect: 'none',
        }}
        component={'p'}
        variant={'h6'}
      >
        {t('UploadFile')}
      </Typography>
    </div>
  );
};
