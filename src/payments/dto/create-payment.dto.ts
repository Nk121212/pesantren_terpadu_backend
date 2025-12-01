import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsEnum,
  IsString,
} from "class-validator";
import { PaymentMethod, PaymentStatus } from "@prisma/client";

export class CreatePaymentDto {
  @IsInt()
  @IsNotEmpty()
  invoiceId: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(PaymentMethod)
  @IsOptional()
  method?: PaymentMethod;

  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @IsString()
  @IsOptional()
  proofUrl?: string;
}
