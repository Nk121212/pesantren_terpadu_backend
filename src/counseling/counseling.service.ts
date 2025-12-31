import { PrismaService } from "../prisma/prisma.service";
import { CounselingStatus } from "@prisma/client";
import { Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class CounselingService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [
      totalSessions,
      totalPlanned,
      totalOngoing,
      totalCompleted,
      totalCancelled,
    ] = await Promise.all([
      this.prisma.counselingSession.count(),
      this.prisma.counselingSession.count({
        where: { status: CounselingStatus.PLANNED },
      }),
      this.prisma.counselingSession.count({
        where: { status: CounselingStatus.ONGOING },
      }),
      this.prisma.counselingSession.count({
        where: { status: CounselingStatus.COMPLETED },
      }),
      this.prisma.counselingSession.count({
        where: { status: CounselingStatus.CANCELLED },
      }),
    ]);

    return {
      success: true,
      data: {
        totalSessions,
        totalPlanned,
        totalOngoing,
        totalCompleted,
        totalCancelled,
      },
    };
  }

  async createSession(dto: any) {
    // Cek apakah santri ada
    const santri = await this.prisma.santri.findUnique({
      where: { id: dto.santriId },
    });

    if (!santri) {
      throw new NotFoundException(`Santri with ID ${dto.santriId} not found`);
    }

    // Cek apakah counselor ada (jika counselorId diberikan)
    if (dto.counselorId) {
      const counselor = await this.prisma.user.findUnique({
        where: { id: dto.counselorId },
      });

      if (!counselor) {
        throw new NotFoundException(
          `Counselor with ID ${dto.counselorId} not found`
        );
      }
    }

    // Format scheduledAt jika ada
    const data = { ...dto };

    if (data.scheduledAt) {
      // Pastikan format datetime yang valid
      const date = new Date(data.scheduledAt);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
      data.scheduledAt = date.toISOString();
    }

    return this.prisma.counselingSession.create({
      data,
      include: {
        santri: {
          select: {
            id: true,
            name: true,
            gender: true,
          },
        },
        counselor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async listSessions(skip = 0, take = 20) {
    return this.prisma.counselingSession.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
      include: {
        santri: {
          select: {
            id: true,
            name: true,
            gender: true,
          },
        },
        counselor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getSession(id: number) {
    return this.prisma.counselingSession.findUnique({
      where: { id },
      include: {
        santri: {
          select: {
            id: true,
            name: true,
            gender: true,
          },
        },
        counselor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateStatus(id: number, status: string) {
    return this.prisma.counselingSession.update({
      where: { id },
      data: { status: status as CounselingStatus },
      include: {
        santri: {
          select: {
            id: true,
            name: true,
            gender: true,
          },
        },
        counselor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
