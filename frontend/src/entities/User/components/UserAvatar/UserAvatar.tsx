import React from 'react';
import { stringToColor } from '@/utils/helpers/stringToColor';
import { getTextColorOnBackground } from '@/utils/helpers/getContrast';
import { Avatar } from '@mui/material';
import { ConvertNameForImg } from '@/utils/helpers/convertNameForImg';
type UserAvatarProps = {
  name: string;
  img?: string;
  size: 'small' | 'medium' | 'large';
};
export const UserAvatar: React.FC<UserAvatarProps> = ({ name, size, img }) => {
  const isImg = img ? img.trim().length > 0 : false;
  const bgColor = stringToColor(name);
  const textColor = getTextColorOnBackground(bgColor);

  const avatarStyles = {
    fontSize: size === 'large' ? 70 : 15,
    color: textColor,
    backgroundColor: isImg ? 'transparent' : bgColor,
    width: size === 'large' ? 200 : size === 'medium' ? 45 : 30,
    height: size === 'large' ? 200 : size === 'medium' ? 45 : 30,
  };
  return (
    <Avatar sx={avatarStyles} alt={name} src={img}>
      {ConvertNameForImg(name)}
    </Avatar>
  );
};
