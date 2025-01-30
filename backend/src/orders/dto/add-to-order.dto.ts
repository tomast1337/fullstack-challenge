import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AddToOrderDto {
  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'The product ID',
    example: 1,
  })
  id: number;

  @IsInt()
  @Min(1)
  @ApiProperty({
    description: 'The quantity of the product',
    example: 1,
  })
  quantity: number;
}
