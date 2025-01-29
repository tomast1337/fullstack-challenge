import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

import { UserService } from '@server/user/user.service';
import { JwtService } from '@nestjs/jwt';

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
  let service: AuthService;

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

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
