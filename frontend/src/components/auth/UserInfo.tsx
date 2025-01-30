'use client';
import { Button } from '@frontend/components/ui/button';
import { Avatar } from '@frontend/components/ui/avatar';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import LogoutIcon from '@mui/icons-material/Logout';
import { useShallow } from 'zustand/react/shallow';
import { useAuth } from '@frontend/hooks/use-auth';
import { useEffect } from 'react';
import { logout } from '@frontend/lib/axios/token.utils';

export const UserInfo = () => {
  const { name, email, picture, updateUserInfo } = useAuth(
    useShallow((state) => ({
      updateUserInfo: state.updateUserInfo,
      name: state.name,
      email: state.email,
      picture: state.picture,
    })),
  );

  useEffect(() => {
    updateUserInfo();
  }, [updateUserInfo]);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Avatar>
        <AvatarImage src={picture} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <p className='text-white font-semibold'>{name}</p>
        <p className='text-gray-400 text-sm'>{email}</p>
        <div className='h-2' />
        <Button
          onClick={handleLogout}
          className='bg-blue-600 hover:bg-blue-500 transition rounded-lg'
        >
          <LogoutIcon className='w-5 h-5' />
          Logout
        </Button>
      </div>
    </>
  );
};
