import { TokenPayload, TokenPayloadWithExp } from '@backend/auth/types/token';
export class InvalidTokenError extends Error {
  constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidTokenError.prototype);
  }
}

export const getTokenLocal = (): string | never => {
  // get the token cookie
  const cookie = document.cookie;

  const token = cookie
    .split('; ')
    .find((row) => row.startsWith('token'))
    ?.split('=')[1];

  // TODO: should be changed to a redirect to the login page?
  if (!token) throw new InvalidTokenError('Token not found');

  return token;
};

export const isLogedIn = () => {
  // get the token cookie
  const cookie = document.cookie;

  const token = cookie
    .split('; ')
    .find((row) => row.startsWith('token'))
    ?.split('=')[1];

  const refreshToken = cookie
    .split('; ')
    .find((row) => row.startsWith('refresh_token'))
    ?.split('=')[1];

  if (!token || !refreshToken) return false;

  // verify if the token is expired
  const { exp } = getTokenInfo(token);
  const now = Date.now() / 1000;
  if (exp < now) return false;

  return true;
};

export const getTokenInfo = (token: string): TokenPayloadWithExp => {
  const payload = token.split('.')[1];
  const decodedPayload = atob(payload);
  const tokenInfo = JSON.parse(decodedPayload);
  return tokenInfo;
};

export const logout = () => {
  const cookiesToBeDeleted = ['refresh_token', 'token'];

  cookiesToBeDeleted.forEach((cookie) => {
    if (!document) return;

    if (process.env.NODE_ENV === 'development') {
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/`;
    } else {
      document.cookie = `${cookie}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; Domain=${process.env.NEXT_PUBLIC_APP_DOMAIN}`;
    }
  });
  window.location.href = '/';
};
