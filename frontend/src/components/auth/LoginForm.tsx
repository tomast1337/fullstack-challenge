'use client';
import { Input } from '@frontend/components/ui/input';
import { Button } from '@frontend/components/ui/button';
import { Label } from '@radix-ui/react-label';
import LoginIcon from '@mui/icons-material/Login';
import { requestMagicLink } from '@frontend/hooks/use-auth';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@frontend/hooks/use-toast';

const loginFormValidationSchema = zod.object({
  email: zod
    .string()
    .email('Invalid email address')
    .nonempty('Email is required'),
});

type LoginFormType = zod.infer<typeof loginFormValidationSchema>;

export const LoginForm = () => {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginFormValidationSchema),
  });

  const onSubmit = async (data: LoginFormType) => {
    try {
      await requestMagicLink(data.email);
      toast({
        title: 'Email sent',
        description: 'Check your inbox for the magic link',
      });
    } catch {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again',
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
      <Label htmlFor='email' className='text-sm text-gray-300'>
        Email
      </Label>
      <Input
        id='email'
        placeholder='Enter your email'
        className='rounded-lg'
        {...register('email')}
      />
      {errors.email && <p className='text-red-500'>{errors.email.message}</p>}
      <Button
        type='submit'
        className='bg-blue-600 hover:bg-blue-500 transition rounded-lg flex items-center gap-2'
      >
        <LoginIcon className='w-5 h-5' />
        Login
      </Button>
    </form>
  );
};
