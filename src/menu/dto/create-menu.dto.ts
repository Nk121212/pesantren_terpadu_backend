import { IsString, IsOptional, IsBoolean, IsInt, Min } from "class-validator";

export class CreateMenuDto {
  @IsOptional()
  @IsInt()
  parentId?: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
