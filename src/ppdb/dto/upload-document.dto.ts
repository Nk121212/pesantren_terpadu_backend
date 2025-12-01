import { IsString } from "class-validator";

export class UploadDocumentDto {
  @IsString()
  fileName: string;

  @IsString()
  filePath: string;
}
