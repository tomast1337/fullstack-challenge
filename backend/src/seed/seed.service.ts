import { faker } from '@faker-js/faker';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { ProductService } from '@server/product/product.service';
import { UserService } from '@server/user/user.service';

@Injectable()
export class SeedService {
  public readonly logger = new Logger(SeedService.name);
  constructor(
    @Inject('NODE_ENV')
    private readonly NODE_ENV: string,

    @Inject(UserService)
    private readonly userService: UserService,

    @Inject(ProductService)
    private readonly productService: ProductService,
  ) {}

  public async seedDev() {
    if (this.NODE_ENV !== 'development') {
      this.logger.error('Seeding is only allowed in development mode');
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const createdUsers = await this.seedUsers();
    this.logger.log(`Created ${createdUsers.length} users`);
    const createdSongs = await this.seedProducs(createdUsers);
    this.logger.log(`Created ${createdSongs.length} songs`);
  }

  private async seedUsers() {
    const createdUsers: User[] = [];

    for (let i = 0; i < 64; i++) {
      const user = await this.userService.createWithEmail(
        faker.internet.email(),
      );
      createdUsers.push(user);
    }

    return createdUsers;
  }

  private async seedProducs(users: User[]) {
    const createdSongs = [];

    for (let i = 0; i < 256; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const song = await this.productService.create(
        {
          category: faker.music.genre(),
          description: faker.lorem.paragraphs(
            faker.number.int({ min: 1, max: 3 }),
          ),
          name: faker.company.catchPhraseNoun(),
          price: faker.number.float({ min: 0.99, max: 99.99 }),
          stockQuantity: faker.number.int() + 1,
        },
        user,
        {
          buffer: Buffer.from(''),
          originalname: 'default.jpg',
        } as Express.Multer.File,
      );
      createdSongs.push(song);
    }

    return createdSongs;
  }
}
