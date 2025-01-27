import { Inject, Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from '@server/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload, Tokens } from './types/token';
import type { Request, Response } from 'express';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
    @Inject(JwtService)
    private readonly jwtService: JwtService,
    @Inject('COOKIE_EXPIRES_IN')
    private readonly COOKIE_EXPIRES_IN: string,
    @Inject('FRONTEND_URL')
    private readonly FRONTEND_URL: string,

    @Inject('JWT_SECRET')
    private readonly JWT_SECRET: string,
    @Inject('JWT_EXPIRES_IN')
    private readonly JWT_EXPIRES_IN: string,
    @Inject('JWT_REFRESH_SECRET')
    private readonly JWT_REFRESH_SECRET: string,
    @Inject('JWT_REFRESH_EXPIRES_IN')
    private readonly JWT_REFRESH_EXPIRES_IN: string,
    @Inject('APP_DOMAIN')
    private readonly APP_DOMAIN?: string,
  ) {}

  public async verifyToken(req: Request, res: Response) {
    const headers = req.headers;
    const authorizationHeader = headers.authorization;

    if (!authorizationHeader) {
      return res.status(401).json({ message: 'No authorization header' });
    }

    const token = authorizationHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.JWT_SECRET,
      });

      // verify if user exists
      const user_registered = await this.userService.findOne(decoded.id);

      if (!user_registered) {
        return res.status(401).json({ message: 'Unauthorized' });
      } else {
        return decoded;
      }
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }

  public async loginWithEmail(req: Request, res: Response) {
    const user = req.user as User;

    if (!user) {
      return res.redirect(this.FRONTEND_URL + '/login');
    }

    return this.GenTokenRedirect(user, res);
  }

  public async createJwtPayload(payload: TokenPayload): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.JWT_SECRET,
        expiresIn: this.JWT_EXPIRES_IN,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.JWT_REFRESH_SECRET,
        expiresIn: this.JWT_REFRESH_EXPIRES_IN,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async GenTokenRedirect(
    user_registered: User,
    res: Response<any, Record<string, any>>,
  ): Promise<void> {
    const token = await this.createJwtPayload({
      id: user_registered.id,
      email: user_registered.email,
      name: user_registered.name,
      picture: user_registered.picture,
    });

    const frontEndURL = this.FRONTEND_URL;
    const domain = this.APP_DOMAIN;
    const maxAge = parseInt(this.COOKIE_EXPIRES_IN) * 1000;

    res.cookie('token', token.access_token, {
      domain: domain,
      maxAge: maxAge,
    });

    res.cookie('refresh_token', token.refresh_token, {
      domain: domain,
      maxAge: maxAge,
    });

    res.redirect(frontEndURL + '/');
  }

  public async getUserFromToken(token: string): Promise<User> {
    const decoded = this.jwtService.decode(token) as TokenPayload;

    if (!decoded) {
      return null;
    }

    const user = await this.userService.findOne(decoded.id);

    return user;
  }
}
