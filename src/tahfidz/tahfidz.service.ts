import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class TahfidzService {
  constructor(private prisma: PrismaService) {}

  async createRecord(dto: any) {
    return this.prisma.tahfidzRecord.create({ data: dto });
  }

  async getBySantri(santriId: number) {
    return this.prisma.tahfidzRecord.findMany({ where: { santriId } });
  }
}
