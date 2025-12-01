import { IsOptional, IsNumber, IsString } from "class-validator";

export class GetReportDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  santriId?: number;

  @IsOptional()
  @IsNumber()
  staffId?: number;
}
