import { IsEnum, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsNumber()
  value: number;
}
