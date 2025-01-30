import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetRequestToken } from '@server/GetRequestUser';
import { PagingDto } from '@server/dto/paging.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';
import { AddToOrderDto } from './dto/add-to-order.dto';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('my')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({
    description: "Get the user's current order",
  })
  findMyCurrentOrder(@GetRequestToken() user: User | null) {
    if (!user)
      throw new HttpException(
        {
          message: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );

    return this.ordersService.findMyCurrentOrder(user);
  }

  @Patch('my')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({
    description: "Update the user's current order",
  })
  updateMyOrder(
    @GetRequestToken() user: User | null,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    if (!user)
      throw new HttpException(
        {
          message: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    return this.ordersService.updateMyOrder(updateOrderDto, user);
  }

  @Patch('my/order-items')
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({
    description: "Add a product to the user's current order",
  })
  addToMyOrder(
    @GetRequestToken() user: User | null,
    @Body() createOrderDto: AddToOrderDto,
  ) {
    if (!user)
      throw new HttpException(
        {
          message: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    return this.ordersService.addToMyOrder(createOrderDto, user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt-refresh'))
  @ApiBearerAuth()
  @ApiOperation({
    description: 'Get all orders for the user',
  })
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
}
