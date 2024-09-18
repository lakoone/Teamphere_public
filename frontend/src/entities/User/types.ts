export type UserType = {
  id: number;
  profile: UserProfile;
};
export type UserProfile = {
  name: string;
  img: string;
  bio: string;
  tag: string;
  tagColor: string;
  isPhotoVisible?: boolean;
};
export type RegisterUser = {
  name: string;
  email: string;
  password: string;
  img?: File;
  bio?: string;
  tag?: string;
  tagColor?: string;
  isPhotoVisible?: boolean;
};
