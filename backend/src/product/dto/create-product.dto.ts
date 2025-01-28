import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The name of the product',
    example: 'Product Name',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The category of the product',
    example: 'Product Category',
  })
  category: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The description of the product',
    example: 'Product Description',
  })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The image of the product',
    example: 'Product Image',
  })
  price: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The image of the product',
    example: 'Product Image',
  })
  stockQuantity: number;
}
