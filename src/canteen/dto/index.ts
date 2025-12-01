import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateMerchantDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateCanteenTxDto {
  @Type(() => Number)
  @IsInt()
  santriId: number;

  @Type(() => Number)
  @IsInt()
  merchantId: number;

  @Type(() => Number)
  @IsInt()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(["QRIS", "VA", "EWALLET", "BANK_TRANSFER"])
  paymentMethod?: "QRIS" | "VA" | "EWALLET" | "BANK_TRANSFER";

  @IsOptional()
  @IsString()
  proofUrl?: string;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  createdBy?: number;
}
