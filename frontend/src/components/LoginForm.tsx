import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from '@radix-ui/react-label';
import LoginIcon from '@mui/icons-material/Login';

export const LoginForm = () => {
  return (
    <>
      <Label className='text-sm text-gray-300'>Email</Label>
      <Input placeholder='Enter your email' className='rounded-lg' />
      <Button className='bg-blue-600 hover:bg-blue-500 transition rounded-lg'>
        <LoginIcon className='w-5 h-5' />
        Login
      </Button>
    </>
  );
};
