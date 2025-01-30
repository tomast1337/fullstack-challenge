import ClientAxios from '@frontend/lib/axios/clientAxios';
import { create } from 'zustand';
//curl -X 'POST' \
//  'http://localhost:4000/api/v1/auth/login/magic-link' \
//  -H 'accept: */*' \
//  -H 'Content-Type: application/json' \
//  -d '{
//  "destination": "vycasnicolas@gmail.com"
//}'

export const requestMagicLink = (email: string) => {
  return ClientAxios.post('/auth/login/magic-link', {
    destination: email,
  });
};

type UseAuth = {
  name: string;
  email: string;
  picture: string;
};

export const useAuth = create<UseAuth>(() =>
  /* set */
  {
    return {
      name: '',
      email: '',
      picture: '',
    };
  },
);
