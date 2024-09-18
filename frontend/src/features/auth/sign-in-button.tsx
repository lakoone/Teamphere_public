import React from 'react';
import Button from '@mui/material/Button';
import styles from '@/features/Login/ui/LoginForm/LoginForm.module.scss';
import GoogleIcon from '@/shared/icons/GoogleIcon';

interface SignInButtonProps {
  provider: string;
  title: string;
}
const SignInButton: React.FC<SignInButtonProps> = ({ title }) => {
  const handleSignIn = async () => {
    window.location.href = `${process.env.NEXT_PUBLIC_STATUS === 'prod' ? process.env.NEXT_PUBLIC_DOMAIN : 'http://localhost:5000'}/api/auth/google`;
  };

  return (
    <Button variant={'outlined'} onClick={handleSignIn}>
      <div className={styles.googleButton}>
        <GoogleIcon />
        {title}
      </div>
    </Button>
  );
};

export default SignInButton;
