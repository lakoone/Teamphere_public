import type { Metadata } from 'next';
import './globals.scss';
import AppProvider from '@/app/theme/AppProvider';
import React from 'react';

export const metadata: Metadata = {
  title: 'Teamphere',
  description: 'Your team work app',
  icons: ['/logo.png'],
};
export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const serverLocale = locale || 'en';

  return (
    <html suppressHydrationWarning={true} lang={serverLocale}>
      <AppProvider>
        <body>{children}</body>
      </AppProvider>
    </html>
  );
}
