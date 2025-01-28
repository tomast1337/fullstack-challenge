import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
  })
  name?: string;
}
