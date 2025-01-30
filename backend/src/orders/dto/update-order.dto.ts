import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsEnum(OrderStatus)
  @IsOptional()
  @ApiProperty({
    description: 'The status of the order',
    example: 'PENDING',
  })
  status: OrderStatus;
}
