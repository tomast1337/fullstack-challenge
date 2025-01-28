import { IsInt, IsString, IsBoolean, Min, IsOptional } from 'class-validator';

export class PagingDto {
  @IsInt()
  @Min(1)
  page: number;

  @IsInt()
  @Min(1)
  limit: number;

  @IsOptional()
  @IsString()
  query: string;

  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @IsBoolean()
  order: boolean;
}
