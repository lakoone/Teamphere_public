'use client';
import { refreshToken } from '@/shared/api/fetching';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from '@/shared/components/Loader';
import { Colors } from '@/styles/colors/colors';

const RefreshPage = () => {
  const router = useRouter();
  useEffect(() => {
    const TokenRefresher = async () => {
      try {
        await refreshToken();
        const redirectUrl = new URLSearchParams(window.location.search).get(
          'redirect',
        );
        if (redirectUrl) {
          router.push(redirectUrl);
        }
      } catch (error) {
        router.push('/login');
      }
    };
    TokenRefresher();
  }, [router]);
  return (
    <div
      style={{
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        backgroundColor: Colors.BACKGROUND,
      }}
    >
      <Loader />
    </div>
  );
};
export default RefreshPage;
