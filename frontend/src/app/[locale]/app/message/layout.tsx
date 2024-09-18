import { ReactNode } from 'react';
import { getChatsMetadata } from '@/shared/api/serverActions';
import MessageClientLayout from '@/app/[locale]/app/message/clientLayout';

export default async function MessageLayout({
  children,
}: {
  children: ReactNode;
}) {
  const chatsMetadata = await getChatsMetadata();
  if (chatsMetadata)
    return (
      <MessageClientLayout chatsMetadata={chatsMetadata}>
        {children}
      </MessageClientLayout>
    );
}
