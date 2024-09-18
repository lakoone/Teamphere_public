import React from 'react';
import { NextIntlClientProvider, useMessages } from 'next-intl';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const message = useMessages();
  return (
    <NextIntlClientProvider messages={message}>
      {children}
    </NextIntlClientProvider>
  );
};

export default Layout;
