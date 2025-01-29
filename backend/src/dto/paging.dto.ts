import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsBoolean, Min, IsOptional } from 'class-validator';

export class PagingDto {
  @IsInt()
  @Min(1)
  @ApiProperty({
    default: 1,
    example: 1,
    description: 'The page number',
  })
  page: number;

  @IsInt()
  @Min(25)
  @ApiProperty({
    default: 25,
    example: 25,
    description: 'The number of items per page',
  })
  limit: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    default: '',
    example: '',
    description: 'The search query',
    required: false,
  })
  query: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    default: 'id',
    example: 'id',
    description: 'The field to sort by',
  })
  sort: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    default: false,
    example: false,
    description: 'The order of the sort',
  })
  order: boolean;
}
