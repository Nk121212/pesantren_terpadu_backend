import { IsBoolean } from "class-validator";

export class ApproveTransactionDto {
  @IsBoolean()
  approve: boolean;
}
