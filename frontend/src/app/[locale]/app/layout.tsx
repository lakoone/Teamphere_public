import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import LayoutClient from '@/app/[locale]/app/LayoutClient';
import { getInitialData } from '@/shared/api/serverActions';
import { getMessages } from 'next-intl/server';
import { AxiosError } from 'axios';
import { redirect } from '@/navigation/navigation';
export default async function AppLayout({ children }: { children: ReactNode }) {
  try {
    const data = await getInitialData();
    if (data) {
      const {
        friends,
        userData,
        unreadChats,
        requests,
        tasksForMe,
        createdTasks,
      } = data;
      const messages = await getMessages();

      return (
        <NextIntlClientProvider messages={messages}>
          <LayoutClient
            unreadChats={unreadChats}
            requests={requests}
            user={userData}
            friends={friends}
            taskForMe={tasksForMe}
            createdTasks={createdTasks}
          >
            {children}
          </LayoutClient>
        </NextIntlClientProvider>
      );
    }
  } catch (e) {
    if (e instanceof AxiosError) {
      redirect(`/tooManyRequest?ref=/app/dashboard`);
    }
  }
}
