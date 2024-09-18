'use client';
import { ReactNode } from 'react';
import { SnackbarProvider } from '@/providers/SnackbarContext';
interface LayoutProps {
  children: ReactNode;
}
const ClientLayout: React.FC<LayoutProps> = ({ children }) => {
  return <SnackbarProvider>{children}</SnackbarProvider>;
};
export default ClientLayout;
