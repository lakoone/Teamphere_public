import styles from '@/entities/task/components/createTask/ui/CreateTask.module.scss';
import { Control, Controller, UseFormSetValue } from 'react-hook-form';
import { TextField, Tooltip } from '@mui/material';
import FileUploadButton from '@/shared/components/FileInput/FileInput';
import convertFileSize from '@/utils/helpers/convertFileSize';
import { CustomChip } from '@/shared/components/CustomChip';
import React from 'react';
import { CreateTaskForm } from '@/entities/task/types/TaskType';
import { useTranslations } from 'next-intl';
interface CreateTaskDescriptionProps {
  control: Control<CreateTaskForm>;
  setValue: UseFormSetValue<CreateTaskForm>;
  files: File[];
}
export const DescriptionSection: React.FC<CreateTaskDescriptionProps> = ({
  control,
  setValue,
  files,
}) => {
  const t = useTranslations('Task');
  return (
    <div className={styles.description}>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            id="outlined-multiline-static"
            label={t('Description')}
            multiline
            variant="outlined"
            minRows={4}
            maxRows={7}
          />
        )}
      />

      <div className={styles.appends}>
        <Controller
          control={control}
          render={({ field }) => (
            <FileUploadButton
              multiple={true}
              name={'TaskFiles'}
              field={field}
            />
          )}
          name="files"
        />

        <ul>
          {files.map((file) => {
            if (file)
              return (
                <Tooltip
                  key={file.name}
                  sx={{
                    zIndex: 600,
                  }}
                  title={`${file.name} ${convertFileSize(file.size)}`}
                >
                  <li>
                    <CustomChip
                      maxWidth={'250px'}
                      onDelete={() => {
                        const filtered = files.filter(
                          (File) => File.name !== file.name,
                        );
                        setValue('files', filtered);
                      }}
                      key={file.name}
                      clickable={true}
                      text={`${file.name} ${convertFileSize(file.size)}`}
                      size={'medium'}
                      status={'dark'}
                    />
                  </li>
                </Tooltip>
              );
          })}
        </ul>
      </div>
    </div>
  );
};
