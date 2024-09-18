import { UserProfile } from '@/entities/User/types';

export interface UpdateProfileData extends Partial<UserProfile> {
  newImg: File[];
}
