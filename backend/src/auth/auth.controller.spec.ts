import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MagicLinkEmailStrategy } from './strategies/magicLinkEmail.strategy';
import { Request, Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let magicLinkEmailStrategy: MagicLinkEmailStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            loginWithEmail: jest.fn(),
          },
        },
        {
          provide: MagicLinkEmailStrategy,
          useValue: {
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    magicLinkEmailStrategy = module.get<MagicLinkEmailStrategy>(
      MagicLinkEmailStrategy,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('magicLinkLogin', () => {
    it('should call MagicLinkEmailStrategy.send with correct parameters', async () => {
      const req = { body: { destination: 'test@example.com' } } as Request;
      const res = {} as Response;
      await controller.magicLinkLogin(req, res);
      expect(magicLinkEmailStrategy.send).toHaveBeenCalledWith(req, res);
    });
  });

  describe('magicLinkRedirect', () => {
    it('should call AuthService.loginWithEmail with correct parameters', async () => {
      const req = {} as Request;
      const res = {} as Response;
      await controller.magicLinkRedirect(req, res);
      expect(authService.loginWithEmail).toHaveBeenCalledWith(req, res);
    });
  });
});
