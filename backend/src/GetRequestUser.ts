import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  createParamDecorator,
} from '@nestjs/common';

import { User } from '@prisma/client';

export const GetRequestToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.existingUser as User;

    return user;
  },
);

export const validateUser = (user: User | null) => {
  if (!user) {
    throw new HttpException(
      {
        error: {
          user: 'User not found',
        },
      },
      HttpStatus.UNAUTHORIZED,
    );
  }

  return user;
};
