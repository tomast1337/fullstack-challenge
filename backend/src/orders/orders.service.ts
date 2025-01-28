import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from '@prisma/client';
import { PagingDto } from '@server/dto/paging.dto';
import { PrismaService } from '@server/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(PrismaService)
    private prismaService: PrismaService,
  ) {}
  public async create(createOrderDto: CreateOrderDto, user: User) {
    const { orderItems } = createOrderDto;
    const order = await this.prismaService.order.create({
      data: {
        orderItems: {
          create: orderItems.map((item) => ({
            product: {
              connect: {
                id: item.productId,
              },
            },
            quantity: item.quantity,
          })),
        },
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    return order;
  }

  public async findAll(user: User, { limit, page, order }: PagingDto) {
    const orders = await this.prismaService.order.findMany({
      where: {
        userId: user.id,
      },
      take: limit,
      skip: limit * (page - 1),
      orderBy: {
        createdAt: order ? 'asc' : 'desc',
      },
    });

    return orders;
  }

  public async findOne(id: number, user: User) {
    const order = await this.prismaService.order.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    return order;
  }

  public async update(id: number, updateOrderDto: UpdateOrderDto, user: User) {
    const { orderItems } = updateOrderDto;
    // if order status is COMPLETED or CANCELED, return an error
    const order = await this.prismaService.order.findFirst({
      where: {
        id,
        userId: user.id,
        status: {
          notIn: ['COMPLETED', 'CANCELED'],
        },
      },
    });

    if (!order) {
      throw new HttpException(
        {
          message: 'Order not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedOrder = await this.prismaService.order.update({
      where: {
        id,
      },
      data: {
        orderItems: {
          create: orderItems.map((item) => ({
            product: {
              connect: {
                id: item.productId,
              },
            },
            quantity: item.quantity,
          })),
        },
      },
    });

    return updatedOrder;
  }

  public async remove(id: number, user: User) {
    // only allow deletion of orders with status PENDING
    const order = await this.prismaService.order.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!order) {
      throw new HttpException(
        {
          message: 'Order not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    if (order.status !== 'PENDING') {
      throw new HttpException(
        {
          message: 'Order cannot be deleted',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const deletedOrder = await this.prismaService.order.delete({
      where: {
        id,
      },
    });

    return deletedOrder;
  }
}
