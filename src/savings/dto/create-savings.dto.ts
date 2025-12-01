import { IsInt, IsNotEmpty } from "class-validator";

export class CreateSavingsDto {
  @IsInt()
  @IsNotEmpty()
  santriId: number;
}
