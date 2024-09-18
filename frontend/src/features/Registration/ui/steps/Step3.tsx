'use client';
import styles from './Steps.module.scss';
import { Button, TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useData } from '@/providers/RegistrationContext/DataProvider';
import React from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const Step3 = () => {
  const tValidation = useTranslations('Validations');
  const t = useTranslations('Registration');

  const schema = z
    .object({
      password: z
        .string()
        .min(8)
        .regex(/^(?=.*[A-Z])(?=.*[0-9]).{8,}$/, {
          message: tValidation('Password'),
        }),
      confirm: z.string().min(1, { message: tValidation('Required') }),
    })
    .refine((data) => data.password === data.confirm, {
      message: tValidation('ConfirmPass'),
      path: ['confirm'],
    });
  const context = useData();
  type LoginData = z.infer<typeof schema>;
  const { control, handleSubmit, formState } = useForm<LoginData>({
    mode: 'onBlur',
    resolver: zodResolver(schema),
    defaultValues: {
      password: context.data?.password,
      confirm: '',
    },
  });
  const onSubmit: SubmitHandler<LoginData> = (data) => {
    context.setSteps!(context.step! + 1);
    context.setValues && context.setValues({ password: data.password });
  };
  return (
    <div className={styles.container}>
      <form className={styles.Form} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              {...field}
              required
              type={'password'}
              inputProps={{ maxLength: 40 }}
              color={'primary'}
              label={t('Password')}
              error={!!error}
              helperText={error?.message}
              variant="standard"
            />
          )}
        />
        <Controller
          name="confirm"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              {...field}
              required
              type={'password'}
              inputProps={{ maxLength: 40 }}
              color={'primary'}
              label={t('ConfirmPass')}
              error={!!error}
              helperText={error?.message}
              variant="standard"
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
          {!formState.errors.password && !formState.errors.confirm && (
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
                {t('Next')}
              </Button>
            </motion.div>
          )}
        </div>
      </form>
    </div>
  );
};
