'use client';
import styles from './MessageInput.module.scss';
import { IconButton, TextField } from '@mui/material';
import SendIcon from '@/shared/icons/SendIcon';
import React, { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';
import { CustomChip } from '@/shared/components/CustomChip';
import { BorderLinearProgress } from '@/shared/components/Taskbar/UI/BorderLinearProgress';
import { Colors } from '@/styles/colors/colors';
import FileUploadButton from '@/shared/components/FileInput/FileInput';
import { useMessageInputForm } from '@/features/chats/components/selectedChat/components/chatInput/hooks/useMessageInputForm';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

export const MessageInput: React.FC = () => {
  const t = useTranslations('MessagePage');
  const uploadCancelSource = useRef(axios.CancelToken.source());
  const chatCancelSource = useRef(axios.CancelToken.source());
  const [loaded, setLoaded] = useState(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { control, watch, onSubmit, getValues, setValue, handleSubmit } =
    useMessageInputForm(
      setIsProcessing,
      setLoaded,
      uploadCancelSource.current.token,
      chatCancelSource.current.token,
    );
  const files = watch('files');
  const IdParam = useSearchParams().get('id');

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (event.ctrlKey || event.shiftKey) {
        const textarea = event.target as HTMLTextAreaElement;
        const value = getValues('text');
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        if (value) {
          // Insert newline character at the cursor position
          const newValue =
            value.substring(0, start) + '\n' + value.substring(end);
          setValue('text', newValue);

          // Move the cursor to the new position after the newline
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start + 1;
          }, 0);
        }
      } else {
        handleSubmit(onSubmit)();
      }
    }
  };
  const hendleDeleteFile = (selectedFile: File) => {
    setValue(
      'files',
      getValues('files').filter(
        (file) =>
          file.name !== selectedFile.name || file.type !== selectedFile.type,
      ),
    );
  };
  return (
    <form className={styles.MessageInput} onSubmit={handleSubmit(onSubmit)}>
      {loaded > 0 && (
        <BorderLinearProgress
          percent={true}
          textColor={Colors.SURFACE}
          total={100}
          completed={loaded}
        />
      )}
      <ul className={styles.files}>
        {files.map((file) => (
          <li key={`${file.size}${file.name}`}>
            <CustomChip
              onDelete={
                !isProcessing ? () => hendleDeleteFile(file) : undefined
              }
              clickable={!isProcessing}
              text={file.name}
              size={'medium'}
              status={'dark'}
            />
          </li>
        ))}
      </ul>
      <div className={styles.inputContainer}>
        <Controller
          name={'files'}
          control={control}
          render={({ field }) => (
            <FileUploadButton
              disabled={isProcessing}
              multiple={true}
              field={field}
              name={'messageFileInput'}
            />
          )}
        />
        <div className={styles.input}>
          <Controller
            name="text"
            control={control}
            render={({ field }) => (
              <TextField
                disabled={isProcessing}
                {...field}
                sx={{
                  width: '100%',
                }}
                onKeyDown={(event) => handleKeyDown(event)}
                inputProps={{
                  autoComplete: 'off',
                  maxLength: 350,
                }}
                color={'primary'}
                id="standard-basic"
                multiline
                maxRows={4}
                label={t('Message')}
                variant={'filled'}
                size="small"
              />
            )}
          />
        </div>
        <IconButton
          onClick={() => {
            if (!isProcessing) handleSubmit(onSubmit)();
            else {
              if (IdParam) {
                chatCancelSource.current.cancel();
                chatCancelSource.current = axios.CancelToken.source();
              } else {
                uploadCancelSource.current.cancel();
                uploadCancelSource.current = axios.CancelToken.source();
              }
            }
          }}
        >
          {isProcessing ? <CloseIcon /> : <SendIcon />}
        </IconButton>
      </div>
    </form>
  );
};
