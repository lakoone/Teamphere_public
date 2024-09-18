import styles from './DashboardContent.module.scss';
import { TaskWidget } from '../taskWidget/TaskWidget';

export const DashboardContent = () => {
  return (
    <div className={styles.container}>
      <section className={styles.Tasks}>
        <TaskWidget />
      </section>
    </div>
  );
};
