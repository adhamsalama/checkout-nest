import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsNumber, Min, IsDate } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  value: number;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  date: Date;
}
