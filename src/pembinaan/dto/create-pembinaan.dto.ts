import { IsInt, IsOptional, IsString } from "class-validator";

export class CreatePembinaanDto {
  @IsInt()
  santriId: number;

  @IsString()
  type: string; // misal: Akhlak, Kedisiplinan, Kerapian

  @IsOptional()
  @IsInt()
  score?: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsInt()
  mentorId?: number;
}
