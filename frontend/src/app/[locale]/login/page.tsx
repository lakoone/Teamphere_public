import styles from './LoginPage.module.scss';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { Logo } from '@/shared/components/Logo';
import { LoginForm } from '@/features/Login/ui/LoginForm/LoginForm';
import { LoginAnimation } from '@/features/Login/ui/LoginAnimation/LoginAnimation';
import ClientLayout from '@/app/[locale]/login/clientLayout';

const LoginPage: React.FC = () => {
  const message = useMessages();
  return (
    <div className={styles.container}>
      <header className={styles.logo}>
        <Logo isAdaptive={false} />
      </header>
      <NextIntlClientProvider messages={message}>
        <section className={styles.content}>
          <div className={styles.presentation}>
            <LoginAnimation />
          </div>
        </section>
        <div className={styles.LoginForm}>
          <ClientLayout>
            <LoginForm />
          </ClientLayout>
        </div>
      </NextIntlClientProvider>
    </div>
  );
};
export default LoginPage;
