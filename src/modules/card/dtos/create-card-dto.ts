import { IsEnum, IsNumber, IsString } from 'class-validator';
import { CreditCardType } from '../enums/credit-card-type.enum';

export class CreateCardDto {
  @IsNumber()
  number: number;

  @IsNumber()
  cvv: number;

  @IsEnum(CreditCardType)
  type: number;

  @IsString()
  flag: string;

  @IsString()
  owner_id: string;
}
