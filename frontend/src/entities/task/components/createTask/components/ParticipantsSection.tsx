import React, { useEffect, useState } from 'react';
import { User, UserType } from '@/entities/User';
import styles from '../ui/CreateTask.module.scss';
import { Colors } from '@/styles/colors/colors';
import {
  Avatar,
  Chip,
  Container,
  Input,
  TextField,
  Typography,
} from '@mui/material';
import {
  Control,
  Controller,
  FormState,
  UseFormSetValue,
  UseFormTrigger,
} from 'react-hook-form';
import { useTranslations } from 'next-intl';
import MenuItem from '@mui/material/MenuItem';
import { CreateTaskForm } from '@/entities/task/types/TaskType';
import { useAppSelector } from '@/utils/hooks/reduxHook';
export const ParticipantsSection: React.FC<{
  control: Control<CreateTaskForm>;
  responsible: number[];
  setValue: UseFormSetValue<CreateTaskForm>;
  formState: FormState<CreateTaskForm>;
  trigger: UseFormTrigger<CreateTaskForm>;
}> = ({ control, trigger, responsible, setValue, formState }) => {
  const t = useTranslations('Task');
  const tValidation = useTranslations('Validations');
  const chatParticipants = useAppSelector(
    (state) => state.selectedChat.selectedChat.chatParticipants,
  );
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredChatParticipants, setFilteredChatParticipants] = useState<
    UserType[]
  >([]);
  useEffect(() => {
    if (chatParticipants) setFilteredChatParticipants(chatParticipants);
  }, [searchValue, chatParticipants]);

  return (
    <div className={styles.participants}>
      <div className={styles.name}>
        <Typography fontWeight={'bold'} sx={{ color: Colors.SURFACE }}>
          {t('Name')}
        </Typography>
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              style={{
                width: '65%',
              }}
              hiddenLabel={true}
              required
              inputProps={{ maxLength: 60 }}
              color={'primary'}
              placeholder={t('NamePlaceholder')}
              error={!!error}
              helperText={error ? tValidation('Required') : ''}
              variant="standard"
            />
          )}
        />
      </div>
      <div className={styles.author}>
        <Typography fontWeight={'bold'} sx={{ color: Colors.SURFACE }}>
          {t('Assignees')}
        </Typography>
        <div className={styles.find}>
          <Input
            onFocus={() => {
              if (chatParticipants)
                setFilteredChatParticipants(chatParticipants);
            }}
            fullWidth
            disableUnderline
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            inputProps={{ maxLength: 40 }}
            color="primary"
            placeholder={t('Search')}
          />
          {filteredChatParticipants.length > 0 && (
            <Container
              sx={{
                maxHeight: '150px',
                padding: '0 !important',
                paddingRight: '10px !important ',
                overflowY: 'auto',
                gap: '5px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {filteredChatParticipants.map((user) => (
                <MenuItem
                  key={user.id}
                  onClick={async () => {
                    if (!responsible.includes(user.id)) {
                      setValue('responsible', [...responsible, user.id]);
                      await trigger('responsible');
                    }
                  }}
                  sx={{
                    display: 'flex',
                    gap: '10px',
                    borderRadius: '20px',
                    paddingLeft: '9px',
                  }}
                >
                  <Avatar
                    sx={{
                      width: '30px',
                      height: '30px',
                    }}
                    src={user.profile.img}
                  />
                  <Typography component={'span'} variant="subtitle2">
                    {user.profile.name}
                  </Typography>
                </MenuItem>
              ))}
            </Container>
          )}
        </div>
        <ul>
          {formState.errors.responsible ? (
            <Typography color={Colors.RED}>
              {tValidation('Responsible')}
            </Typography>
          ) : (
            responsible.map((ID) => {
              const found = chatParticipants.find(
                (user) => user.id === Number(ID),
              )!;
              if (found)
                return (
                  <li key={ID}>
                    <Chip
                      onDelete={() => {
                        const filtered = responsible.filter((id) => id !== ID);
                        setValue('responsible', filtered);
                      }}
                      avatar={<User user={found} size={'avatar'} />}
                      label={found.profile.name}
                    />
                  </li>
                );
            })
          )}
        </ul>
      </div>
    </div>
  );
};
