import { IsOptional, IsNumber, IsEnum } from "class-validator";
import { PaymentMethod, PaymentStatus } from "@prisma/client";

export class UpdatePaymentDto {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}
