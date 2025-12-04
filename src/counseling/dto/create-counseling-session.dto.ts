import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
} from "class-validator";
import { CounselingStatus } from "@prisma/client";

export class CreateCounselingSessionDto {
  @IsNotEmpty()
  @IsNumber()
  santriId: number;

  @IsOptional()
  @IsNumber()
  counselorId?: number;

  @IsNotEmpty()
  @IsString()
  topic: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  recommendation?: string;

  @IsOptional()
  @IsEnum(CounselingStatus)
  status?: CounselingStatus;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
