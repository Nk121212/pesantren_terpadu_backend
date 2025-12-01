import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateAuditDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsString()
  action: string;

  @IsString()
  module: string;

  @IsOptional()
  @IsString()
  detail?: string;
}
