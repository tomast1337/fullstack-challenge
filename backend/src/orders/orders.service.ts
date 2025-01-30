import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from '@prisma/client';
import { PagingDto } from '@server/dto/paging.dto';
import { PrismaService } from '@server/prisma/prisma.service';
import { AddToOrderDto } from './dto/add-to-order.dto';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    @Inject(PrismaService)
    private prismaService: PrismaService,
  ) {}
  public async createNew(
    createOrderDto: CreateOrderDto,
    user: User,
  ): Promise<OrderDto> {
    const { orderItems } = createOrderDto;
    const order = await this.prismaService.order.create({
      data: {
        status: 'PENDING',
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

    return OrderDto.fromEntity(order, []);
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
  public async findMyCurrentOrder(user: User): Promise<OrderDto> {
    try {
      const order = await this.prismaService.order.findFirst({
        where: {
          userId: user.id,
          status: 'PENDING',
        },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });
      return OrderDto.fromEntity(
        order,
        order.orderItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price,
          name: item.product.name,
        })),
      );
    } catch {
      // no order found: create a new one
      const order = await this.createNew(
        {
          orderItems: [],
          status: 'PENDING',
        },
        user,
      );
      return order;
    }
  }

  public async updateMyOrder(updateOrderDto: UpdateOrderDto, user: User) {
    // if order status is COMPLETED or CANCELED, return an error
    const order = await this.prismaService.order.findFirst({
      where: {
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

    const { status } = updateOrderDto;

    const updatedOrder = await this.prismaService.order.update({
      where: {
        id: order.id,
      },
      data: {
        status,
      },
    });

    if (status === 'COMPLETED') {
      // create a new order
      await this.createNew(
        {
          orderItems: [],
          status: 'PENDING',
        },
        user,
      );

      // remove from all products the quantity ordered
      const orderItems = await this.prismaService.orderItem.findMany({
        where: {
          orderId: order.id,
        },
      });

      for (const orderItem of orderItems) {
        await this.prismaService.product.update({
          where: {
            id: orderItem.productId,
          },
          data: {
            stockQuantity: {
              decrement: orderItem.quantity,
            },
          },
        });
      }
    }

    return updatedOrder;
  }

  public async addToMyOrder(
    { id: productId, quantity }: AddToOrderDto,
    user: User,
  ) {
    let order = await this.prismaService.order.findFirst({
      where: {
        userId: user.id,
        status: 'PENDING',
      },
    });

    if (!order) {
      this.logger.error(`Order not found for user: ${user.id}, creating one`);
      this.createNew(
        {
          orderItems: [],
          status: 'PENDING',
        },
        user,
      );
      order = await this.prismaService.order.findFirst({
        where: {
          userId: user.id,
          status: 'PENDING',
        },
      });
    }

    this.logger.log(
      `Adding product to order: ${productId}, quantity: ${quantity}, to order: ${order.id}`,
    );

    // verify if the product exists

    const product = await this.prismaService.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      this.logger.error(`Product not found: ${productId}`);
      throw new HttpException(
        {
          message: 'Product not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // verify if the there is enough stock
    if (product.stockQuantity < quantity) {
      this.logger.error(
        `Not enough stock for product: ${productId}, quantity: ${quantity}`,
      );
      throw new HttpException(
        {
          message: 'Not enough stock',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // create the order item
    await this.prismaService.orderItem.create({
      data: {
        orderId: order.id,
        productId,
        quantity,
      },
    });

    // return the updated order
    const updatedOrder = await this.prismaService.order.findFirst({
      where: {
        userId: user.id,
        status: 'PENDING',
      },
    });

    return updatedOrder;
  }
}
