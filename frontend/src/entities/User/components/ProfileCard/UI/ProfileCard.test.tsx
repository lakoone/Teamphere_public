import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProfileCard } from './ProfileCard';
import { UserType } from '@/entities/User/types';
import { NextIntlClientProvider } from 'next-intl';
import messages from '@/../locales/en.json';

const mockUser: UserType = {
  id: 1,
  profile: {
    name: 'John Doe',
    img: '',
    bio: 'A simple bio',
    tag: 'Admin',
    tagColor: 'blue',
    isPhotoVisible: true,
  },
};

const mockHandleClose = jest.fn();

describe('ProfileCard Component', () => {
  const renderComponent = () =>
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ProfileCard user={mockUser} handleClose={mockHandleClose} />
      </NextIntlClientProvider>,
    );

  it('renders user profile information correctly', () => {
    renderComponent();

    const avatar = screen.getByText('JD');
    expect(avatar).toBeInTheDocument();

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    expect(screen.getByText('@1')).toBeInTheDocument();

    expect(screen.getByText('Admin')).toBeInTheDocument();

    expect(screen.getByText('A simple bio')).toBeInTheDocument();
  });

  it('renders buttons correctly', () => {
    renderComponent();

    const sendMessageButton = screen.getByText('Send message');
    expect(sendMessageButton).toBeInTheDocument();

    const closeButton = screen.getByText('Close');
    expect(closeButton).toBeInTheDocument();
  });

  it('calls handleClose on close button click', () => {
    renderComponent();

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(mockHandleClose).toHaveBeenCalled();
  });

  it('disables close button when handleClose is not provided', () => {
    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ProfileCard user={mockUser} />
      </NextIntlClientProvider>,
    );

    const closeButton = screen.getByText('Close');
    expect(closeButton).toBeDisabled();
  });

  it('renders role only if cleanTag is not empty', () => {
    const userWithEmptyTag: UserType = {
      id: 2,
      profile: {
        name: 'Jane Doe',
        img: '',
        bio: '',
        tag: '',
        tagColor: 'green',
        isPhotoVisible: true,
      },
    };

    render(
      <NextIntlClientProvider locale="en" messages={messages}>
        <ProfileCard user={userWithEmptyTag} handleClose={mockHandleClose} />
      </NextIntlClientProvider>,
    );

    expect(screen.queryByText('Admin')).not.toBeInTheDocument();
  });
});
