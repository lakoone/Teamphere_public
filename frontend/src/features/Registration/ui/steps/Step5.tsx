'use client';
import styles from './Steps.module.scss';
import { Button, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useData } from '@/providers/RegistrationContext/DataProvider';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from '@/navigation/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { register } from '@/features/Registration/model/api';
import { removeExtraSpaces } from '@/utils/helpers/removeExtraSpaces';

export const Step5 = () => {
  const t = useTranslations('Registration');
  const router = useRouter();

  const schema = z.object({
    bio: z.string().optional(),
  });
  const context = useData();
  type LoginData = z.infer<typeof schema>;
  const { control, watch, handleSubmit } = useForm<LoginData>({
    mode: 'onBlur',
    resolver: zodResolver(schema),
    defaultValues: {
      bio: context.data?.bio,
    },
  });
  const actualBio = watch('bio');
  useEffect(() => {
    if (context.setValues) context.setValues({ bio: actualBio });
  }, [actualBio]);
  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    if (context.data?.name && context.data?.email && context.data.password) {
      const BIO = data.bio ? removeExtraSpaces(data.bio) : '';
      const res = await register({
        name: context.data.name,
        email: context.data.email,
        password: context.data.password,
        img: context.data.img,
        tag: '',
        tagColor: '#ffffff',
        bio: BIO,
        isPhotoVisible: true,
      });
      if (res) {
        router.push('app/dashboard');
      }
    }
  };
  return (
    <div className={styles.container}>
      <form className={styles.Form} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="bio"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              label={t('Biography')}
              multiline
              inputProps={{ maxLength: 400 }}
              sx={{ width: '100%' }}
              error={!!error}
              helperText={error?.message}
              rows={11}
              placeholder={t('BiographyPlaceholder')}
            />
          )}
        />
        <div className={styles.Buttons}>
          <Button
            onClick={() => {
              context.setSteps!(context.step! - 1);
            }}
            color={'inherit'}
            variant={'contained'}
          >
            {t('Back')}
          </Button>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Button
              sx={{
                marginLeft: 'auto',
              }}
              type={'submit'}
              variant={'contained'}
            >
              {t('Submit')}
            </Button>
          </motion.div>
        </div>
      </form>
    </div>
  );
};
