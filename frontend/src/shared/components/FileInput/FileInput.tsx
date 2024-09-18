'use client';
import React, { ChangeEvent } from 'react';

import { ControllerRenderProps } from 'react-hook-form';
import { IconButton } from '@mui/material';
import AppendIcon from '@/shared/icons/AppendIcon';
import { useSnackbar } from '@/providers/SnackbarContext';
import { useTranslations } from 'next-intl';

interface FileUploadButtonProps {
  name: string;
  field: ControllerRenderProps<any, any>;
  multiple?: boolean;
  maxFileQty?: number;
  accept?: string;
  maxSize?: number;
  disabled?: boolean;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  name,
  field,
  multiple = false,
  maxFileQty = 5,
  disabled = false,
  maxSize = 50,
  accept = '',
  ...props
}) => {
  const t = useTranslations('Validations');
  const { showSnackbar } = useSnackbar();
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];

    const SummarySize = files.reduce(
      (accumulator, currentValue) => accumulator + currentValue.size,
      0,
    );
    if (maxSize * 1024 * 1024 < SummarySize) {
      showSnackbar(`${t('FileTooLarge')} ${maxSize}Mb`, 'error');
    } else if (files.length > 5) {
      showSnackbar(`${t('MaxFileMessage')} ${maxFileQty}`, 'error');
    } else {
      field.onChange(files);
    }
  };

  return (
    <>
      <input
        disabled={disabled}
        type="file"
        multiple={multiple}
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        onBlur={field.onBlur}
        ref={field.ref}
        id={name}
      />
      <label htmlFor={name}>
        <IconButton sx={{ width: '40px' }} component="span" {...props}>
          <AppendIcon />
        </IconButton>
      </label>
    </>
  );
};

export default FileUploadButton;
