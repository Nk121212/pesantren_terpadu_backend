import {
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsNumber,
  IsString,
} from "class-validator";
import { TransactionType, TransactionStatus } from "@prisma/client";

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString()
  proofUrl?: string;
}
