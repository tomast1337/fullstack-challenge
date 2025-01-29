import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { SeedService } from './seed.service';

@Controller('seed')
@ApiTags('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('seed-users')
  @ApiOperation({
    summary: 'Adds 64 users to the database',
  })
  async seed() {
    this.seedService.seedDev();
    return {
      message: 'Seeding in progress',
    };
  }

  @Get('seed-products')
  @ApiOperation({
    summary: 'Add 256 products to the database with random users',
  })
  async seedProducts() {
    this.seedService.seedProducs();
    return {
      message: 'Seeding in progress',
    };
  }

  @Get('seed-orders')
  @ApiOperation({
    summary:
      'Add 128 orders to the database with random users and random on stock products',
  })
  async seedOrders() {
    this.seedService.seedOrders();
    return {
      message: 'Seeding in progress',
    };
  }
}
