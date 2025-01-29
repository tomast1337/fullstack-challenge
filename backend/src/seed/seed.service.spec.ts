import { Test, TestingModule } from '@nestjs/testing';

import { UserService } from '@server/user/user.service';

import { ProductService } from '@server/product/product.service';
import { SeedService } from './seed.service';

describe('SeedService', () => {
  let service: SeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: 'NODE_ENV',
          useValue: 'development',
        },
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: ProductService,
          useValue: {
            uploadSong: jest.fn(),
            getSongById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
