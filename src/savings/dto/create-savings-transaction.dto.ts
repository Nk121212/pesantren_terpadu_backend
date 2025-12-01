import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
} from "class-validator";
import { TransactionType } from "@prisma/client";

export class CreateSavingsTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  proofUrl?: string; // path file bukti transfer
}
