import { UserType } from '@/entities/User';

export type CreateUserDTO = {
  userData: UserType['profile'];
  authData: {
    email: string;
    password: string;
  };
};
