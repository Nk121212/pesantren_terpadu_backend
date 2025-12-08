import { PartialType } from "@nestjs/mapped-types";
import { CreateTahfidzDto } from "./create-tahfidz.dto";
import { IsOptional, IsInt, Min, Max } from "class-validator";

export class UpdateTahfidzDto extends PartialType(CreateTahfidzDto) {
  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(100)
  score?: number;
}
