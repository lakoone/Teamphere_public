import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { User } from './User';
import { UserType } from '@/entities/User/types';

const mockUser: UserType = {
  id: 1,
  profile: {
    name: 'John Doe',
    img: '',
    bio: 'A simple bio',
    tag: 'Admin',
    tagColor: 'blue',
  },
};

describe('User Component', () => {
  it('renders user name and avatar', () => {
    render(<User user={mockUser} size="medium" />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    const avatar = screen.getByAltText('John Doe');
    expect(avatar).toBeInTheDocument();
  });

  it('opens modal on avatar click', () => {
    render(<User user={mockUser} size="medium" />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByRole('dialog')).toBeVisible();
  });

  it('closes modal on close button click', () => {
    render(<User user={mockUser} size="medium" />);

    fireEvent.click(screen.getByRole('button'));

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
