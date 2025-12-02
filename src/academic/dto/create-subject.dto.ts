import { IsString, IsOptional, IsInt } from "class-validator";

export class CreateSubjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  teacherId?: number;
}
