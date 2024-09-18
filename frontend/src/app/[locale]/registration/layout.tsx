import React from 'react';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { DataProvider } from '@/providers/RegistrationContext/DataProvider';
import ClientLayout from './ClientLayout';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const message = useMessages();
  return (
    <DataProvider>
      <NextIntlClientProvider messages={message}>
        <ClientLayout>{children}</ClientLayout>
      </NextIntlClientProvider>
    </DataProvider>
  );
};

export default Layout;
