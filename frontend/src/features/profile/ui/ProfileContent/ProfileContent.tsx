'use client';
import styles from './ProfileContent.module.scss';
import {
  Alert,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Snackbar,
  Switch,
  TextField,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ProfileCard } from '@/entities/User/components/ProfileCard/UI/ProfileCard';
import { Colors } from '@/styles/colors/colors';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { useAppDispatch, useAppSelector } from '@/utils/hooks/reduxHook';
import { updateProfile } from '@/store/Slices/userSlice';
import { sendUpdateProfile } from '../../model/api';
import FileUploadButton from '@/shared/components/FileInput/FileInput';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserAvatar } from '@/entities/User/components/UserAvatar/UserAvatar';
import { UserType } from '@/entities/User';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from '@/providers/SnackbarContext';

export const ProfileContent: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [previewURL, setPreviewURL] = useState<null | string>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const t = useTranslations('ProfilePage');
  const tValidations = useTranslations('Validations');
  const tProcessing = useTranslations('ProcessingData');
  const user: UserType = useAppSelector((state) => state.user);
  const disptach = useAppDispatch();
  const { showSnackbar } = useSnackbar();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const handleClose = () => {
    setOpen(false);
  };

  const schema = z.object({
    name: z.string().min(1, { message: tValidations('Required') }),
    tag: z.string().max(45),
    bio: z.string(),
    tagColor: z.string(),
    isPhotoVisible: z.boolean(),
    img: z.string(),
    newImg: z.array(z.instanceof(File)),
  });

  type ProfileData = z.infer<typeof schema>;
  const { reset, control, formState, handleSubmit, watch } =
    useForm<ProfileData>({
      resolver: zodResolver(schema),
      defaultValues: {
        newImg: [],
        name: user.profile.name,
        img: user.profile.img || '',
        tag: user.profile.tag,
        bio: user.profile.bio,
        tagColor: user.profile.tagColor,
        isPhotoVisible: user.profile.isPhotoVisible,
      },
      mode: 'onBlur',
    });
  const newImg = watch('newImg');

  useEffect(() => {
    if (newImg.length > 0) {
      const url = URL.createObjectURL(newImg[0]);
      setPreviewURL(url);
    }
  }, [newImg]);
  const onSubmit: SubmitHandler<ProfileData> = async (data) => {
    setIsProcessing(true);
    const res = await sendUpdateProfile(data);

    setIsProcessing(false);
    disptach(updateProfile(res.userData));
    reset({
      ...data,
    });
    setOpen(false);
    showSnackbar(tProcessing('DataChangedSuccessfully'), 'success');
  };

  return (
    <div className={styles.container}>
      <section className={styles.ProfileImage}>
        <div className={styles.image}>
          <UserAvatar
            size={'large'}
            name={user.profile.name}
            img={previewURL || user.profile.img}
          />
        </div>
        <Controller
          control={control}
          render={({ field }) => (
            <FileUploadButton
              name={'newImg'}
              field={field}
              maxFileQty={1}
              accept={'image/'}
              multiple={false}
            />
          )}
          name={'newImg'}
        />
      </section>
      <section className={styles.ProfileData}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.ProfileDataForm}
        >
          {formState.isDirty && (
            <div className={styles.fab}>
              <LoadingButton loading={isProcessing} type={'submit'}>
                {t('Save')}
              </LoadingButton>
              <Button
                disabled={isProcessing}
                onClick={() => reset()}
                color={'error'}
              >
                {t('Cancel')}
              </Button>
            </div>
          )}
          <div className={styles.title}>
            <Controller
              name="name"
              rules={{
                required: true,
                pattern: {
                  value: /^\p{L}+$/u,
                  message: t('errorName'),
                },
              }}
              control={control}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  value={field.value}
                  required
                  inputProps={{ maxLength: 40 }}
                  color={'primary'}
                  id="standard-basic"
                  label={t('Name')}
                  error={!!error}
                  helperText={error?.message}
                  variant="filled"
                />
              )}
            />
            <Divider flexItem />
          </div>

          <div className={styles.infoblock}>
            <Controller
              name="tag"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoComplete="none"
                  color={'primary'}
                  id="standard-basic"
                  label={t('Tag')}
                  inputProps={{ maxLength: 25 }}
                  placeholder={t('TagPlaceholder')}
                  variant="filled"
                />
              )}
            />

            <p className={styles.description}>{t('TagDescription')}</p>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">
                {t('Color')}
              </FormLabel>
              <Controller
                name="tagColor"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    {...field}
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel
                      value={Colors.PINK}
                      control={
                        <Radio
                          sx={{
                            color: Colors.PINK,
                            '&.Mui-checked': { color: Colors.PINK },
                          }}
                        />
                      }
                      label={t('Pink')}
                    />
                    <FormControlLabel
                      value={Colors.BLUE}
                      control={
                        <Radio
                          sx={{
                            color: Colors.BLUE,
                            '&.Mui-checked': { color: Colors.BLUE },
                          }}
                        />
                      }
                      label={t('Blue')}
                    />
                    <FormControlLabel
                      value={Colors.RED}
                      control={
                        <Radio
                          sx={{
                            color: Colors.RED,
                            '&.Mui-checked': { color: Colors.RED },
                          }}
                        />
                      }
                      label={t('Red')}
                    />
                    <FormControlLabel
                      value={Colors.GREEN}
                      control={
                        <Radio
                          sx={{
                            color: Colors.GREEN,
                            '&.Mui-checked': { color: Colors.GREEN },
                          }}
                        />
                      }
                      label={t('Green')}
                    />
                    <FormControlLabel
                      value={Colors.YELLOW}
                      control={
                        <Radio
                          sx={{
                            color: Colors.YELLOW,
                            '&.Mui-checked': { color: Colors.YELLOW },
                          }}
                        />
                      }
                      label={t('Yellow')}
                    />
                    <FormControlLabel
                      value={Colors.WHITE}
                      control={
                        <Radio
                          sx={{
                            color: Colors.WHITE,
                            '&.Mui-checked': { color: Colors.WHITE },
                          }}
                        />
                      }
                      label={t('White')}
                    />
                  </RadioGroup>
                )}
              />
            </FormControl>
            <Divider />
          </div>
          <div className={styles.infoblock}>
            <Controller
              name="isPhotoVisible"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  {...field}
                  control={<Switch checked={field.value} />}
                  label={t('PhotoOption')}
                />
              )}
            />

            <p className={styles.description}>{t('PhotoOptionDescription')}</p>
            <Divider />
          </div>
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                id="outlined-multiline-static"
                label={t('Biography')}
                multiline
                inputProps={{ maxLength: 400 }}
                sx={{ width: isSmallScreen ? '100%' : '400px' }}
                rows={11}
                placeholder={t('BiographyPlaceholder')}
              />
            )}
          />
        </form>
      </section>
      <section className={styles.View}>
        <section className={styles.top}>
          <h2>{t('View')}</h2>
          <p className={styles.description}>{t('ViewDescription')}</p>
        </section>

        <ProfileCard user={user} />
      </section>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" variant="filled">
          {t('SuccessfullySaved')}
        </Alert>
      </Snackbar>
    </div>
  );
};
