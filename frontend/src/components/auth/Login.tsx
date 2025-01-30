'use client';

import { useToast } from '@frontend/hooks/use-toast';
import { isLogedIn } from '@frontend/lib/axios/token.utils';
import { useEffect, useState } from 'react';
import { LoginForm } from './LoginForm';
import { UserInfo } from './UserInfo';

export const LoginInfo = () => {
  const { toast } = useToast();
  const [isLoged, setIsLoged] = useState(false);
  useEffect(() => {
    try {
      const result = isLogedIn();
      if (result) {
        setIsLoged(true);
      } else {
        setIsLoged(false);
      }
    } catch {
      setIsLoged(false);
      toast({
        title: 'Error',
        description: 'An error occurred. Please login again',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{isLoged ? <UserInfo /> : <LoginForm />}</>;
};
