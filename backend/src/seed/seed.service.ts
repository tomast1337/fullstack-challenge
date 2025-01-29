import { faker } from '@faker-js/faker';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { User } from '@prisma/client';
import axios from 'axios';

import { ProductService } from '@server/product/product.service';
import { UserService } from '@server/user/user.service';
import { PrismaService } from '@server/prisma/prisma.service';

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
    @Inject(PrismaService)
    private readonly prismaService: PrismaService,
  ) {}

  public async seedDev() {
    if (this.NODE_ENV !== 'development') {
      this.logger.error('Seeding is only allowed in development mode');
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const createdUsers: User[] = [];

    for (let i = 0; i < 64; i++) {
      const user = await this.userService.createWithEmail(
        faker.internet.email().toLowerCase(),
      );
      createdUsers.push(user);
    }

    this.logger.log(`Created ${createdUsers.length} users`);
  }

  private async seedUsers() {}

  private getRandomSample<T>(array: T[], sampleSize: number): T[] {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, sampleSize);
  }

  public async seedProducs() {
    const users = await this.prismaService.user.findMany();
    const sampleSize = 64; // Define the sample size
    const sampleUsers = this.getRandomSample(users, sampleSize);

    const createdSongs = [];

    const images = ['200/300', '300/200', '300/300', '500/200', '200/500'];

    for (let i = 0; i < 256; i++) {
      const user = sampleUsers[Math.floor(Math.random() * users.length)];

      const image = await axios.get(
        `https://picsum.photos/${images[Math.floor(Math.random() * images.length)]}`,
        {
          responseType: 'arraybuffer',
        },
      );

      const song = await this.productService.create(
        {
          category: faker.commerce.productMaterial(),
          description: faker.commerce.productDescription(),
          name: faker.commerce.productName(),
          price: faker.number.float({ min: 0.99, max: 99.99 }),
          stockQuantity: faker.number.int({ min: 1, max: 100 }) + 1,
        },
        user,
        {
          buffer: image.data,
          originalname: 'default.jpg',
        } as Express.Multer.File,
      );
      createdSongs.push(song);
    }

    return createdSongs;
  }

  public async seedOrders() {
    throw new Error('Method not implemented.');
  }
}
