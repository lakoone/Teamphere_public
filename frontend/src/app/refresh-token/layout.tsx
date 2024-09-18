import type { Metadata } from 'next';
import { Colors } from '@/styles/colors/colors';

export const metadata: Metadata = {
  title: 'Teamphere',
  description: 'Your team work app',
  icons: ['/logo.png'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          overflow: 'hidden',
          width: '100vw',
          height: '100vh',
          backgroundColor: Colors.BACKGROUND,
        }}
      >
        {children}
      </body>
    </html>
  );
}
