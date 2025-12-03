import { IsString, IsOptional, IsInt } from "class-validator";

export class CreateAuditDto {
  @IsString()
  module: string;

  @IsString()
  action: string;

  @IsOptional()
  @IsInt()
  recordId?: number;

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsString()
  note?: string;
}
