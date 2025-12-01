import { IsOptional, IsEnum, IsNumber, IsString } from "class-validator";
import { TransactionStatus } from "@prisma/client";

export class UpdateTransactionDto {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @IsOptional()
  @IsString()
  proofUrl?: string;
}
