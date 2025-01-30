import { ApiProperty } from '@nestjs/swagger';
import { Order, OrderStatus } from '@prisma/client';

class OrderItemDto {
  @ApiProperty({ description: 'The ID of the product', example: 1 })
  productId: number;

  @ApiProperty({ description: 'The quantity of the product', example: 1 })
  quantity: number;

  @ApiProperty({ description: 'The price of the product', example: 1.0 })
  price: number;

  @ApiProperty({ description: 'The name of the product', example: 'Product' })
  name: string;
}

export class OrderDto {
  @ApiProperty({ description: 'The order ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'The status of the order', example: 'PENDING' })
  status: OrderStatus;

  @ApiProperty({ description: 'The date the order was created' })
  createdAt: Date;

  @ApiProperty({ description: 'The date the order was last updated' })
  updatedAt: Date;

  @ApiProperty({
    type: () => [OrderItemDto],
    description: 'The items in the order',
  })
  orderItems: OrderItemDto[];
  public static fromEntity(order: Order, orderItems: OrderItemDto[]): OrderDto {
    return {
      id: order.id,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems,
    };
  }
}
