import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

import { GetRequestToken, validateUser } from './GetRequestUser';
import { User } from '@prisma/client';

describe('GetRequestToken', () => {
  it('should be a defined decorator', () => {
    const mockExecutionContext = {
      switchToHttp: jest.fn().mockReturnThis(),
    } as unknown as ExecutionContext;

    const result = GetRequestToken(null, mockExecutionContext);

    expect(typeof result).toBe('function');
  });
});

describe('validateUser', () => {
  it('should return the user if the user exists', () => {
    const mockUser = {
      _id: 'test-id',
      name: 'testuser',
    } as unknown as User;

    const result = validateUser(mockUser);

    expect(result).toEqual(mockUser);
  });

  it('should throw an error if the user does not exist', () => {
    expect(() => validateUser(null)).toThrowError(
      new HttpException(
        {
          error: {
            user: 'User not found',
          },
        },
        HttpStatus.UNAUTHORIZED,
      ),
    );
  });
});
