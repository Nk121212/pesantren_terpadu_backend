import {
  IsInt,
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
} from "class-validator";

export enum AttendanceStatus {
  PRESENT = "PRESENT",
  SICK = "SICK",
  PERMIT = "PERMIT",
  ABSENT = "ABSENT",
}

export class CreateAttendanceDto {
  @IsInt()
  santriId: number;

  @IsDateString()
  date: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsInt()
  recordedBy?: number;
}
