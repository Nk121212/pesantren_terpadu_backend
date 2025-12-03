// import { PartialType } from "@nestjs/mapped-types";
// import { CreateGradeDto } from "./create-grade.dto";
import {
  IsInt,
  IsNumber,
  IsString,
  IsOptional,
  Min,
  Max,
} from "class-validator";

export class UpdateGradeDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  score?: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}
