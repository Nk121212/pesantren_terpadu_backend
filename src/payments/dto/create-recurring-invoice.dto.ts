import { IsInt, IsNotEmpty, IsOptional, IsEnum } from "class-validator";
import { PaymentMethod } from "@prisma/client";

export class CreateRecurringInvoiceDto {
  @IsInt()
  @IsNotEmpty()
  santriId: number;

  @IsInt()
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  dueDate?: string; // YYYY-MM-DD

  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;
}
