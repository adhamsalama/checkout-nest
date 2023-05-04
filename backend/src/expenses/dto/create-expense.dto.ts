import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsDate,
} from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;

  @IsArray()
  tags: string[];

  @IsOptional()
  @IsString()
  comment?: string;

  @IsDate()
  date: Date;

  @IsOptional()
  @IsString()
  sellerName?: string;
}
