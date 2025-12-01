import {
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
} from "class-validator";
import { InvoiceStatus } from "@prisma/client";

export class CreateInvoiceDto {
  @IsNumber()
  santriId: number;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;
}
