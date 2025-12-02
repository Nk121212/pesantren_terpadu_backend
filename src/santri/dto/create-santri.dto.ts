import { IsString, IsOptional, IsDateString, IsInt } from "class-validator";

export class CreateSantriDto {
  @IsString()
  name: string;

  @IsString()
  gender: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsInt()
  guardianId?: number;
}
