import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

import { UserService } from '@server/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { TokenPayload } from './types/token';

const mockUserService = {
  findByEmail: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  decode: jest.fn(),
  signAsync: jest.fn(),
  verify: jest.fn(),
};

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: 'COOKIE_EXPIRES_IN',
          useValue: '3600',
        },
        {
          provide: 'FRONTEND_URL',
          useValue: 'http://frontend.test.com',
        },
        {
          provide: 'COOKIE_EXPIRES_IN',
          useValue: '3600',
        },
        {
          provide: 'JWT_SECRET',
          useValue: 'test-jwt-secret',
        },
        {
          provide: 'JWT_EXPIRES_IN',
          useValue: '1d',
        },
        {
          provide: 'JWT_REFRESH_SECRET',
          useValue: 'test-jwt-refresh-secret',
        },
        {
          provide: 'JWT_REFRESH_EXPIRES_IN',
          useValue: '7d',
        },
        {
          provide: 'APP_DOMAIN',
          useValue: '.test.com',
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('verifyToken', () => {
    it('should return 401 if no authorization header is provided', async () => {
      const req = { headers: {} } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await authService.verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No authorization header',
      });
    });

    it('should return 401 if no token is provided', async () => {
      const req = { headers: { authorization: 'Bearer ' } } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      await authService.verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    });

    it('should return 401 if token is invalid', async () => {
      const req = {
        headers: { authorization: 'Bearer invalid-token' },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(jwtService, 'verify').mockImplementation(() => {
        throw new Error('Unauthorized');
      });

      await authService.verifyToken(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

    it('should return decoded token if valid', async () => {
      const req = {
        headers: { authorization: 'Bearer valid-token' },
      } as Request;
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      const decodedToken = { id: 1 };
      jest.spyOn(jwtService, 'verify').mockReturnValue(decodedToken);
      jest.spyOn(userService, 'findOne').mockResolvedValue({ id: 1 } as User);

      const result = await authService.verifyToken(req, res);

      expect(result).toEqual(decodedToken);
    });
  });

  describe('loginWithEmail', () => {
    it('should redirect to login if no user', async () => {
      const req = { user: null } as unknown as Request;
      const res = { redirect: jest.fn() } as unknown as Response;

      await authService.loginWithEmail(req, res);

      expect(res.redirect).toHaveBeenCalledWith(
        'http://frontend.test.com/login',
      );
    });

    it('should call GenTokenRedirect if user exists', async () => {
      const req = { user: { id: 1 } } as unknown as Request;
      const res = {} as unknown as Response;

      jest.spyOn(authService as any, 'GenTokenRedirect').mockImplementation();

      await authService.loginWithEmail(req, res);

      expect((authService as any).GenTokenRedirect).toHaveBeenCalledWith(
        req.user,
        res,
      );
    });
  });

  describe('createJwtPayload', () => {
    it('should return tokens', async () => {
      const payload: TokenPayload = {
        email: 'test@example.com',
        name: 'Test User',
        picture: 'test.png',
        id: 0,
      };
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('token');

      const tokens = await authService.createJwtPayload(payload);

      expect(tokens).toEqual({ access_token: 'token', refresh_token: 'token' });
    });
  });

  describe('GenTokenRedirect', () => {
    it('should set cookies and redirect', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        picture: 'test.png',
      } as User;
      const res = {
        cookie: jest.fn(),
        redirect: jest.fn(),
      } as unknown as Response;

      jest
        .spyOn(authService, 'createJwtPayload')
        .mockResolvedValue({ access_token: 'token', refresh_token: 'token' });

      await (authService as any).GenTokenRedirect(user, res);

      expect(res.cookie).toHaveBeenCalledWith('token', 'token', {
        domain: '.test.com',
        maxAge: 3600000,
      });
      expect(res.cookie).toHaveBeenCalledWith('refresh_token', 'token', {
        domain: '.test.com',
        maxAge: 3600000,
      });
      expect(res.redirect).toHaveBeenCalledWith('http://frontend.test.com/');
    });
  });

  describe('getUserFromToken', () => {
    it('should return user if token is valid', async () => {
      const token = 'valid-token';
      const decoded = { id: 1 };

      jest.spyOn(jwtService, 'decode').mockReturnValue(decoded);
      jest.spyOn(userService, 'findOne').mockResolvedValue({ id: 1 } as User);

      const user = await authService.getUserFromToken(token);

      expect(user).toEqual({ id: 1 });
    });

    it('should return null if token is invalid', async () => {
      const token = 'invalid-token';

      jest.spyOn(jwtService, 'decode').mockReturnValue(null);

      const user = await authService.getUserFromToken(token);

      expect(user).toBeNull();
    });
  });
});
