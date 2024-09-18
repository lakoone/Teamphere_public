import { useRouter } from '@/navigation/navigation';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { login } from './api';
import { useSnackbar } from '@/providers/SnackbarContext';
import { AxiosError } from 'axios';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export const useLogin = () => {
  const tValidation = useTranslations('Validations');
  const t = useTranslations('Login');
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const schema = z.object({
    email: z
      .string()
      .min(1, tValidation('Required'))
      .email(tValidation('Email')),
    password: z.string().min(1, tValidation('Required')),
  });

  type LoginData = z.infer<typeof schema>;
  const { control, handleSubmit, setValue } = useForm<LoginData>({
    mode: 'onBlur',
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginData) => {
    try {
      const response = await login(data.email, data.password);
      if (response.status >= 200 && response.status < 300)
        router.push(`/app/dashboard`);
    } catch (error) {
      if (error instanceof AxiosError) {
        showSnackbar(
          error.response ? error.response.data.message : error.message,
          'error',
        );
        setValue('email', '');
        setValue('password', '');
      }
      console.error('Failed to login', error);
    }
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    t,
  };
};
