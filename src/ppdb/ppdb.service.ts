import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePpdbDto } from "./dto/create-ppdb.dto";
import { UpdatePpdbStatusDto } from "./dto/update-ppdb-status.dto";
import { UploadDocumentDto } from "./dto/upload-document.dto";
import { PpdbStatus } from "@prisma/client";

@Injectable()
export class PpdbService {
  constructor(private prisma: PrismaService) {}

  async createApplicant(dto: CreatePpdbDto) {
    const lastApplicant = await this.prisma.ppdbApplicant.findFirst({
      orderBy: { createdAt: "desc" },
    });
    const lastNumber = lastApplicant?.id || 0;
    const registrationNo = `PPDB-${(lastNumber + 1)
      .toString()
      .padStart(4, "0")}`;

    const applicantData: any = {
      ...dto,
      registrationNo,
    };

    if (dto.birthDate) {
      applicantData.birthDate = new Date(dto.birthDate);
    }

    return this.prisma.ppdbApplicant.create({
      data: applicantData,
    });
  }

  async uploadDocument(applicantId: number, dto: UploadDocumentDto) {
    // pastikan applicant ada
    const applicant = await this.prisma.ppdbApplicant.findUnique({
      where: { id: applicantId },
    });
    if (!applicant) throw new NotFoundException("Applicant not found");

    return this.prisma.ppdbDocument.create({
      data: { ...dto, applicantId },
    });
  }

  async listApplicants() {
    return this.prisma.ppdbApplicant.findMany({
      include: { documents: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateStatus(id: number, dto: UpdatePpdbStatusDto) {
    const applicant = await this.prisma.ppdbApplicant.findUnique({
      where: { id },
    });
    if (!applicant) throw new NotFoundException("Applicant not found");

    return this.prisma.ppdbApplicant.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  async getApplicant(id: number) {
    const applicant = await this.prisma.ppdbApplicant.findUnique({
      where: { id },
      include: { documents: true },
    });
    if (!applicant) throw new NotFoundException("Applicant not found");
    return applicant;
  }
}
