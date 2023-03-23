import { IsOptional, IsInt, IsString, IsArray } from 'class-validator';
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
  date?: string;

  @IsOptional()
  @Type(() => String)
  @IsArray()
  tags?: string[];
}

// @Query('date') date: string,
// @Query('limit', ParseIntPipe) limit: number,
// @Query('offset', ParseIntPipe) offset: number,
// @Query('priceLte', ParseIntPipe) priceLte: number,
// @Query('priceGte', ParseIntPipe) priceGte: number,
// @Query('name') name?: string,
// @Query('tags') tags?: string[],
