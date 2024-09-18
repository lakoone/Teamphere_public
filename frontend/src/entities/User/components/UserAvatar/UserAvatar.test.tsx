import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UserAvatar } from './UserAvatar';
import { UserProfile } from '@/entities/User/types';

const mockProfile: UserProfile = {
  name: 'Jane Doe',
  img: '',
  bio: 'Another simple bio',
  tag: 'User',
  tagColor: 'green',
};

describe('UserAvatar Component', () => {
  it('renders the avatar with initials if no image', () => {
    render(
      <UserAvatar
        name={mockProfile.name}
        img={mockProfile.img}
        size="medium"
      />,
    );

    const avatar = screen.getByText('JD');
    expect(avatar).toBeInTheDocument();
  });

  it('renders the avatar with image if provided', () => {
    render(
      <UserAvatar
        name={mockProfile.name}
        img={'path/to/image.jpg'}
        size="medium"
      />,
    );

    const avatarImg = screen.getByRole('img');
    expect(avatarImg).toHaveAttribute('src', 'path/to/image.jpg');
  });
});
