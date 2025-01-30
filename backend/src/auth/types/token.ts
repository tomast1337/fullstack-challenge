export type TokenPayload = {
  id: number;
  email: string;
  name: string;
  picture: string;
};

export type TokenPayloadWithExp = TokenPayload & {
  exp: number;
  iat: number;
};

export type Tokens = {
  access_token: string;
  refresh_token: string;
};
