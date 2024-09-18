import styles from './DashboardPage.module.scss';
import { Header } from '@/shared/components/Header';
import { DashboardContent } from '@/features/dashboard/components/dashboardContent/DashboardContent';
import { useTranslations } from 'next-intl';

const DashboardPage = () => {
  const t = useTranslations('DashboardPage');

  return (
    <>
      <div className={styles.container}>
        <Header>
          <h1>{t('Dashboard')}</h1>
        </Header>
        <DashboardContent />
      </div>
    </>
  );
};
export default DashboardPage;
