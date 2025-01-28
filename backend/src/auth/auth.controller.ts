import { Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { MagicLinkEmailStrategy } from './strategies/magicLinkEmail.strategy';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    @Inject(AuthService)
    private readonly authService: AuthService,
    @Inject(MagicLinkEmailStrategy)
    private readonly magicLinkEmailStrategy: MagicLinkEmailStrategy,
  ) {}

  @Throttle({
    default: {
      // one every 1 hour
      ttl: 60 * 60 * 1000,
      limit: 1,
    },
  })
  @Post('login/magic-link')
  @ApiOperation({
    summary:
      'Will send the user a email with a single use login link, if the user does not exist it will create a new user',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              destination: {
                type: 'string',
                example: 'vycasnicolas@gmail.com',
                description: 'Email address to send the magic link to',
              },
            },
            required: ['destination'],
          },
        },
      },
    },
  })
  public async magicLinkLogin(@Req() req: Request, @Res() res: Response) {
    return this.magicLinkEmailStrategy.send(req, res);
  }
}
