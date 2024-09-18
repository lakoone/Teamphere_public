import styles from './profile.module.scss';
import { ProfileHeader } from '@/features/profile/ui/ProfileHeader/ProfileHeader';
import { ProfileContent } from '@/features/profile/ui/ProfileContent/ProfileContent';
const ProfilePage: React.FC = () => {
  return (
    <div className={styles.container}>
      <ProfileHeader />
      <ProfileContent />
    </div>
  );
};
export default ProfilePage;
