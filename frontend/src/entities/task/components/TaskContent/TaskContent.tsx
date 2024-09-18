import React from 'react';
import {
  Control,
  Controller,
  Path,
  SetValueConfig,
  UseFormWatch,
} from 'react-hook-form';
import { Divider, TextField } from '@mui/material';
import { User } from '@/entities/User';
import { FileChip } from '@/entities/file/ui/FileChip';
import FileUploadButton from '@/shared/components/FileInput/FileInput';
import { CustomChip } from '@/shared/components/CustomChip';
import { TaskForm, TaskType } from '../../types/TaskType';
import styles from '../../ui/Task.module.scss';
import { useTranslations } from 'next-intl';
import { Time } from '@/shared/components/Time';
import { Box } from '@mui/system';

type TaskContentProps = {
  task: TaskType;
  control: Control<TaskForm>;
  isAuthor: boolean;
  setValue: (
    name: Path<TaskForm>,
    value: any,
    config?: Partial<SetValueConfig>,
  ) => void;
  watch: UseFormWatch<TaskForm>;
};

const TaskContent: React.FC<TaskContentProps> = ({
  task,
  control,
  isAuthor,
  setValue,
  watch,
}) => {
  const t = useTranslations('Task');
  const answerNewFiles = watch('answerNewFiles');
  const descriptionNewFiles = watch('descriptionNewFiles');

  const handleDeleteFile = (file: File) => {
    setValue(
      'answerNewFiles',
      answerNewFiles.filter(
        (appends) =>
          appends.name !== file.name || appends.type !== appends.type,
      ),
    );
  };

  return (
    <form className={styles.content}>
      <div className={styles.participants}>
        <Box
          sx={{
            width: 'fit-content',
          }}
        >
          <Time size={'small'} timeFormat={'dayHour'} date={task.createdAt} />
        </Box>
        <div className={styles.author}>
          <h5 className={styles.title}>{t('CreatedBy')} :</h5>
          <User size={'small'} user={task.createdBy} />
        </div>
        <div className={styles.author}>
          <h5 className={styles.title}>{t('Assignees')} :</h5>
          <ul>
            {task.usersAssigned.map((assignee) => (
              <li key={assignee.user.id}>
                <User size={'small'} user={assignee.user} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Task Description */}
      <div className={styles.description}>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              disabled={!isAuthor}
              label={t('Description')}
              InputProps={{ disableUnderline: true }}
              multiline
              maxRows={12}
              variant="standard"
            />
          )}
        />

        <div className={styles.appends}>
          {isAuthor && (
            <Controller
              name="descriptionNewFiles"
              control={control}
              render={({ field }) => (
                <FileUploadButton
                  multiple={true}
                  name={'descriptionNewFiles'}
                  field={field}
                />
              )}
            />
          )}

          <ul>
            {task.taskDescriptionFiles.map((file) => (
              <li key={file.file.id}>
                <FileChip file={file.file} />
              </li>
            ))}
          </ul>
          <ul>
            {isAuthor &&
              descriptionNewFiles.map((file) => (
                <li key={`${file.size}${file.name}`}>
                  <CustomChip
                    onDelete={() => handleDeleteFile(file)}
                    clickable={true}
                    text={file.name}
                    size={'medium'}
                    status={'dark'}
                  />
                </li>
              ))}
          </ul>
        </div>
      </div>

      <Divider flexItem />

      {/* Task Answer */}
      <div className={styles.answer}>
        <h5>{t('Answer')} :</h5>
        <Controller
          name="answer"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              disabled={isAuthor || task.status === 'sent'}
              InputProps={{ disableUnderline: true }}
              variant="standard"
              multiline
              maxRows={12}
              label={t('Answer')}
            />
          )}
        />

        <div className={styles.appends}>
          {!isAuthor && task.status !== 'sent' && (
            <Controller
              name="answerNewFiles"
              control={control}
              render={({ field }) => (
                <FileUploadButton
                  multiple={true}
                  name={'answerNewFiles'}
                  field={field}
                />
              )}
            />
          )}

          <ul>
            {task.taskAnswerFiles.map((file) => (
              <li key={file.file.id}>
                <FileChip file={file.file} />
              </li>
            ))}
          </ul>
          <ul>
            {!isAuthor &&
              answerNewFiles.map((file) => (
                <li key={`${file.size}${file.name}`}>
                  <CustomChip
                    onDelete={() => handleDeleteFile(file)}
                    clickable={true}
                    text={file.name}
                    size={'medium'}
                    status={'dark'}
                  />
                </li>
              ))}
          </ul>
        </div>
      </div>
    </form>
  );
};

export default TaskContent;
