import {
  IsInt,
  IsNumber,
  IsString,
  IsOptional,
  Min,
  Max,
} from "class-validator";

export class CreateGradeDto {
  @IsInt()
  santriId: number;

  @IsInt()
  subjectId: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  score: number;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsInt()
  @Min(1)
  @Max(2)
  semester: number;

  @IsInt()
  @Min(2000)
  @Max(2100)
  year: number;
}
