import { IsString, IsOptional, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Role } from "@prisma/client";

export class CreateRoleDto {
  @IsString()
  name: Role;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateRoleDto {
  @IsOptional()
  @IsString()
  description?: string;
}
