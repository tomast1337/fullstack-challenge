'use client';
import { Avatar } from '@frontend/components/ui/avatar';
import { Button } from '@frontend/components/ui/button';
import { useAuth } from '@frontend/hooks/use-auth';
import { useOrder } from '@frontend/hooks/use-order';
import { logout } from '@frontend/lib/axios/token.utils';
import LogoutIcon from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
export const UserInfo = () => {
  const router = useRouter();
  const { name, email, picture, updateUserInfo } = useAuth(
    useShallow((state) => ({
      updateUserInfo: state.updateUserInfo,
      name: state.name,
      email: state.email,
      picture: state.picture,
    })),
  );

  const { order } = useOrder(
    useShallow((state) => ({
      ...state,
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
      <div className='flex items-center gap-4 w-full mb-6'>
        <Button
          onClick={() => router.push('/cart')}
          className='bg-blue-600 hover:bg-blue-500 transition rounded-lg w-full'
        >
          <ShoppingCartIcon className='w-5 h-5' />
          Cart
          {order && order.orderItems.length > 0 ? (
            <span className='bg-red-500 text-white rounded-full px-2 py-1 text-xs'>
              {order.orderItems.length}
            </span>
          ) : (
            <span className='bg-gray-500 text-white rounded-full px-2 py-1 text-xs'>
              0
            </span>
          )}
        </Button>
      </div>
      <div className='flex items-center gap-4'>
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
            className='bg-blue-600 hover:bg-blue-500 transition rounded-lg w-full'
          >
            <LogoutIcon className='w-5 h-5' />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};
