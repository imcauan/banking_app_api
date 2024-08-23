import { IsEnum, IsNumber, IsString } from 'class-validator';
import { TransactionType } from '../enums/transaction-type.enum';

export class CreateTransactionDto {
  @IsString()
  from: string;

  @IsString()
  to: string;

  @IsEnum(TransactionType)
  type: number;

  @IsNumber()
  value: number;

  image: File;
}
