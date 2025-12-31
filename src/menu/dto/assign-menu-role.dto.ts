import { IsString, IsBoolean, IsInt, IsOptional } from "class-validator";
import { Role } from "@prisma/client";

export class AssignMenuRoleDto {
  @IsString()
  role: Role;

  @IsInt()
  menuId: number;

  @IsOptional()
  @IsBoolean()
  canView?: boolean;

  @IsOptional()
  @IsBoolean()
  canCreate?: boolean;

  @IsOptional()
  @IsBoolean()
  canEdit?: boolean;

  @IsOptional()
  @IsBoolean()
  canDelete?: boolean;

  @IsOptional()
  @IsBoolean()
  canExport?: boolean;
}
