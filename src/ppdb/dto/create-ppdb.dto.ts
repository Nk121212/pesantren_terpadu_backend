import { IsString, IsOptional, IsDateString, IsEmail } from "class-validator";

export class CreatePpdbDto {
  @IsString()
  name: string;

  @IsString()
  gender: string;

  @IsDateString()
  birthDate?: string;

  @IsString()
  address?: string;

  @IsString()
  guardianName?: string;

  @IsString()
  guardianPhone?: string;

  @IsEmail()
  email?: string;
}
