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

// Update CreateAttendanceDto
export class CreateAttendanceDto {
  @IsInt()
  santriId: number;

  @IsDateString() // Atau @IsISO8601()
  date: string; // Format: "2024-01-15T00:00:00.000Z"

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  remarks?: string;

  @IsOptional()
  @IsInt()
  recordedBy?: number;
}
