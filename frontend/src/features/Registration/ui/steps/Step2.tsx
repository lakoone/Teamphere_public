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
import { checkEmail } from '@/features/Registration/model/api';

export const Step2 = () => {
  const tValidation = useTranslations('Validations');
  const t = useTranslations('Registration');
  const schema = z.object({
    email: z
      .string()
      .min(1, { message: tValidation('Required') })
      .email({ message: tValidation('Email') })
      .superRefine(async (val, ctx) => {
        try {
          const response = await checkEmail(val);
          if (response.isEmailExist) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: tValidation('EmailAlreadyExists'),
            });
          }
        } catch (e) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Failed to validate email. Please try again later.',
          });
        }
      }),
  });
  const context = useData();
  type LoginData = z.infer<typeof schema>;
  const { control, handleSubmit, formState } = useForm<LoginData>({
    mode: 'onBlur',
    resolver: zodResolver(schema),
    defaultValues: {
      email: context.data?.email,
    },
  });
  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    context.setSteps!(context.step! + 1);
    context.setValues && context.setValues({ email: data.email });
  };
  return (
    <div className={styles.container}>
      <form className={styles.Form} onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              {...field}
              required
              inputProps={{ maxLength: 40 }}
              color={'primary'}
              label={t('Email')}
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
          {!formState.errors.email && (
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
