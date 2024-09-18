'use client';
import styles from './LoginForm.module.scss';
import { Controller } from 'react-hook-form';
import { TextField, Typography } from '@mui/material';
import { useRouter } from '@/navigation/navigation';
import SignInButton from '@/features/auth/sign-in-button';
import Button from '@mui/material/Button';
import React from 'react';
import { useLogin } from '../../model/useLogin';

export const LoginForm = () => {
  const { control, handleSubmit, onSubmit, t } = useLogin();
  const router = useRouter();
  return (
    <section className={styles.login}>
      <Typography
        sx={{
          whiteSpace: 'break-spaces',
        }}
        fontWeight={'bold'}
        variant={'h4'}
        component={'h2'}
      >
        {t('LogIn')}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.loginForm}>
        <Controller
          name="email"
          defaultValue={''}
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              required
              color={'primary'}
              inputProps={{ maxLength: 60 }}
              label="Email"
              variant="standard"
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
        <Controller
          defaultValue={''}
          name="password"
          control={control}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              required
              color={'primary'}
              inputProps={{ maxLength: 60 }}
              label={t('Password')}
              type="password"
              variant="standard"
              error={!!error}
              helperText={error ? error.message : null}
            />
          )}
        />
        <div className={styles.actions}>
          <div className={styles.options}>
            <Button
              onClick={() => router.push('/registration')}
              fullWidth
              variant={'outlined'}
              color={'info'}
            >
              {t('Registration')}
            </Button>
            <Button fullWidth variant={'outlined'} type={'submit'}>
              {t('LogIn')}
            </Button>
          </div>

          <SignInButton provider={'google'} title={t('Google')} />
        </div>
      </form>
    </section>
  );
};
