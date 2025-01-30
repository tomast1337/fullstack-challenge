import ClientAxios from '@frontend/lib/axios/clientAxios';
import { getTokenInfo, getTokenLocal } from '@frontend/lib/axios/token.utils';
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
  updateUserInfo: () => void;
};

export const useAuth = create<UseAuth>((set) => {
  const getUserInfo = () => {
    const token = getTokenLocal();
    const { name, email, picture } = getTokenInfo(token);

    set({
      name,
      email,
      picture,
    });
  };

  return {
    name: '',
    email: '',
    picture: '',
    updateUserInfo: getUserInfo,
  };
});
