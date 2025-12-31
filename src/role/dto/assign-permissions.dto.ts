import { IsString, IsBoolean, IsOptional } from "class-validator";
import { Role } from "@prisma/client";

export class AssignPermissionsDto {
  @IsString()
  role: Role;

  @IsString()
  menuId: string;

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
