import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PagingDto } from '@server/dto/paging.dto';
import { GetRequestToken } from '@server/GetRequestUser';
import { User } from '@prisma/client';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({})
  create(
    @GetRequestToken() user: User | null,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    if (!user)
      throw new HttpException(
        {
          message: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({})
  findAll(@GetRequestToken() user: User | null, @Query() query: PagingDto) {
    if (!user)
      throw new HttpException(
        {
          message: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );

    return this.ordersService.findAll(user, query);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({})
  findOne(@GetRequestToken() user: User | null, @Param('id') id: string) {
    return this.ordersService.findOne(+id, user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({})
  update(
    @GetRequestToken() user: User | null,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    if (!user)
      throw new HttpException(
        {
          message: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    return this.ordersService.update(+id, updateOrderDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({})
  remove(@GetRequestToken() user: User | null, @Param('id') id: string) {
    if (!user)
      throw new HttpException(
        {
          message: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    return this.ordersService.remove(+id, user);
  }
}
