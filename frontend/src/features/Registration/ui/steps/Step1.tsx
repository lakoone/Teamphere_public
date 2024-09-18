'use client';
import styles from './Steps.module.scss';
import { TextField } from '@mui/material';
import { useTranslations } from 'next-intl';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useData } from '@/providers/RegistrationContext/DataProvider';
import Button from '@mui/material/Button';
import React from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const Step1 = () => {
  const tValidation = useTranslations('Validations');
  const t = useTranslations('Registration');

  const schema = z.object({
    name: z
      .string()
      .max(40)
      .min(1, { message: tValidation('Required') })
      .regex(/^[A-Za-z]+(?:\s[A-Za-z]+){0,2}$/i, {
        message: tValidation('Name'),
      }),
  });
  const context = useData();
  type LoginData = z.infer<typeof schema>;
  const { control, handleSubmit, formState } = useForm<LoginData>({
    mode: 'onBlur',
    resolver: zodResolver(schema),
    defaultValues: {
      name: context.data?.name,
    },
  });
  const onSubmit: SubmitHandler<LoginData> = (data) => {
    context.setSteps!(context.step! + 1);
    context.setValues && context.setValues({ name: data.name });
  };
  return (
    <div className={styles.container}>
      <form className={styles.Form} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              {...field}
              required
              inputProps={{ maxLength: 40 }}
              color={'primary'}
              label={t('Name')}
              error={!!error}
              helperText={error?.message}
              variant="standard"
            />
          )}
        />

        {!formState.errors.name && (
          <motion.div
            className={styles.Buttons}
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
      </form>
    </div>
  );
};
