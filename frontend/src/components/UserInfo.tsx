import { Button } from './ui/button';
import { Avatar } from './ui/avatar';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import LogoutIcon from '@mui/icons-material/Logout';

export const UserInfo = ({
  user,
}: {
  user: {
    name: string;
    email: string;
    picture: string;
  };
}) => {
  const { name, email, picture } = user;
  return (
    <>
      <Avatar>
        <AvatarImage src={picture} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div>
        <p className='text-white font-semibold'>{name}</p>
        <p className='text-gray-400 text-sm'>{email}</p>
        <Button className='bg-blue-600 hover:bg-blue-500 transition rounded-lg'>
          <LogoutIcon className='w-5 h-5' />
          Logout
        </Button>
      </div>
    </>
  );
};
