import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { IsArray, IsEnum, IsInt } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  @ApiProperty({
    description: 'The ID of the order',
    example: 1,
  })
  productId: number;

  @IsInt()
  @ApiProperty({
    description: 'The ID of the product',
    example: 1,
  })
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ApiProperty({
    description: 'The items in the order',
    type: CreateOrderItemDto,
    example: [
      {
        orderId: 1,
        productId: 1,
        quantity: 1,
        totalPrice: 1.99,
      },
    ],
  })
  orderItems: CreateOrderItemDto[];

  @IsEnum(OrderStatus)
  @ApiProperty({
    description: 'The status of the order',
    example: 'PENDING',
  })
  status: OrderStatus;
}
