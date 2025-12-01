import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from "@nestjs/common";
import { PpdbService } from "./ppdb.service";
import { CreatePpdbDto } from "./dto/create-ppdb.dto";
import { UpdatePpdbStatusDto } from "./dto/update-ppdb-status.dto";
import { UploadDocumentDto } from "./dto/upload-document.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Controller("ppdb")
@UseGuards(JwtAuthGuard, RolesGuard)
export class PpdbController {
  constructor(private readonly ppdbService: PpdbService) {}

  @Post()
  async createApplicant(@Body() dto: CreatePpdbDto) {
    return this.ppdbService.createApplicant(dto);
  }

  @Post(":applicantId/document")
  @UseInterceptors(FileInterceptor("file"))
  async uploadDocument(
    @Param("applicantId") applicantId: number,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.ppdbService.uploadDocument(applicantId, {
      fileName: file.originalname,
      filePath: `/uploads/${file.filename}`,
    });
  }

  @Get()
  listApplicants() {
    return this.ppdbService.listApplicants();
  }

  @Get(":id")
  getApplicant(@Param("id") id: number) {
    return this.ppdbService.getApplicant(id);
  }

  @Patch(":id/status")
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  async updateStatus(
    @Param("id") id: number,
    @Body() dto: UpdatePpdbStatusDto
  ) {
    return this.ppdbService.updateStatus(id, dto);
  }
}
