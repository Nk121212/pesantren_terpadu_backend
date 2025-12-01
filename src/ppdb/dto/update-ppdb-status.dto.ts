import { IsEnum } from "class-validator";
import { PpdbStatus } from "@prisma/client";

export class UpdatePpdbStatusDto {
  @IsEnum(PpdbStatus)
  status: PpdbStatus;
}
