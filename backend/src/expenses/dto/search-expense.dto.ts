import { IsOptional, IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ExpenseSearch {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  offset?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priceGte?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  priceLte?: number;

  @IsOptional()
  @Type(() => String)
  @IsString()
  name?: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  startDate?: string;

  @IsOptional()
  @Type(() => String)
  @IsString()
  endDate?: string;

  @IsOptional()
  @Type(() => String)
  tags?: string[];
}
