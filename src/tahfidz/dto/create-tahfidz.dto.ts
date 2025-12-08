import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  Max,
  IsDateString,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateTahfidzDto {
  @IsInt()
  @IsNotEmpty()
  santriId: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(30)
  juz: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(604)
  pageStart: number;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(604)
  pageEnd: number;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(100)
  score?: number;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsInt()
  @IsOptional()
  teacherId?: number;

  @IsDateString()
  @IsOptional()
  createdAt?: string;
}
