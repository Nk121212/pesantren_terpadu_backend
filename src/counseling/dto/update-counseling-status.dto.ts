import { IsNotEmpty, IsEnum, IsString } from "class-validator";
import { CounselingStatus } from "@prisma/client";

export class UpdateCounselingStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(CounselingStatus, {
    message: `Status must be one of: ${Object.values(CounselingStatus).join(
      ", "
    )}`,
  })
  status: CounselingStatus;
}
