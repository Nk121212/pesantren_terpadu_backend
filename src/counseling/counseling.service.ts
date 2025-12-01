import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CounselingStatus } from "@prisma/client";

@Injectable()
export class CounselingService {
  constructor(private prisma: PrismaService) {}

  async createSession(dto: any) {
    return this.prisma.counselingSession.create({ data: dto });
  }

  async listSessions(skip = 0, take = 20) {
    return this.prisma.counselingSession.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  }

  async getSession(id: number) {
    return this.prisma.counselingSession.findUnique({ where: { id } });
  }

  async updateStatus(id: number, status: string) {
    return this.prisma.counselingSession.update({
      where: { id },
      data: { status: status as CounselingStatus },
    });
  }
}
