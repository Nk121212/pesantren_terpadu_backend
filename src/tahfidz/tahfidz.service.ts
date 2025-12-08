import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTahfidzDto } from "./dto/create-tahfidz.dto";
import { UpdateTahfidzDto } from "./dto/update-tahfidz.dto";

interface GetAllFilters {
  skip?: number;
  take?: number;
  santriId?: number;
  juz?: number;
  teacherId?: number;
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class TahfidzService {
  constructor(private prisma: PrismaService) {}

  async getAll(filters: GetAllFilters = {}) {
    const {
      skip,
      take = 20,
      santriId,
      juz,
      teacherId,
      startDate,
      endDate,
    } = filters;

    const where: any = {};

    if (santriId) where.santriId = santriId;
    if (juz) where.juz = juz;
    if (teacherId) where.teacherId = teacherId;

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const [records, total] = await Promise.all([
      this.prisma.tahfidzRecord.findMany({
        where,
        skip,
        take,
        include: {
          santri: {
            select: {
              id: true,
              name: true,
              gender: true,
            },
          },
          teacher: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.tahfidzRecord.count({ where }),
    ]);

    return {
      data: records,
      meta: {
        total,
        page: skip ? Math.floor(skip / take) + 1 : 1,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async getById(id: number) {
    const record = await this.prisma.tahfidzRecord.findUnique({
      where: { id },
      include: {
        santri: {
          select: {
            id: true,
            name: true,
            gender: true,
            birthDate: true,
            address: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!record) {
      throw new NotFoundException(`Tahfidz record with ID ${id} not found`);
    }

    return record;
  }

  async createRecord(dto: CreateTahfidzDto) {
    // Validasi tambahan
    if (dto.pageEnd < dto.pageStart) {
      throw new Error("pageEnd harus lebih besar dari pageStart");
    }

    // Validasi halaman maksimal per juz (20 halaman per juz)
    const pagesPerJuz = dto.pageEnd - dto.pageStart + 1;
    if (pagesPerJuz > 20) {
      throw new Error("Maksimal 20 halaman per pencatatan");
    }

    // Validasi santri exists
    const santri = await this.prisma.santri.findUnique({
      where: { id: dto.santriId },
    });

    if (!santri) {
      throw new NotFoundException(`Santri with ID ${dto.santriId} not found`);
    }

    // Jika ada teacherId, validasi teacher exists
    if (dto.teacherId) {
      const teacher = await this.prisma.user.findUnique({
        where: { id: dto.teacherId },
      });

      if (!teacher) {
        throw new NotFoundException(
          `Teacher with ID ${dto.teacherId} not found`
        );
      }
    }

    return this.prisma.tahfidzRecord.create({
      data: dto,
      include: {
        santri: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async updateRecord(id: number, dto: UpdateTahfidzDto) {
    // Check if record exists
    const existingRecord = await this.prisma.tahfidzRecord.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new NotFoundException(`Tahfidz record with ID ${id} not found`);
    }

    // Jika ada perubahan pageStart/pageEnd, validasi
    if (dto.pageStart !== undefined || dto.pageEnd !== undefined) {
      const pageStart = dto.pageStart ?? existingRecord.pageStart;
      const pageEnd = dto.pageEnd ?? existingRecord.pageEnd;

      if (pageEnd < pageStart) {
        throw new Error("pageEnd harus lebih besar dari pageStart");
      }

      const pagesPerJuz = pageEnd - pageStart + 1;
      if (pagesPerJuz > 20) {
        throw new Error("Maksimal 20 halaman per pencatatan");
      }
    }

    return this.prisma.tahfidzRecord.update({
      where: { id },
      data: dto,
      include: {
        santri: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async deleteRecord(id: number) {
    // Check if record exists
    const existingRecord = await this.prisma.tahfidzRecord.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      throw new NotFoundException(`Tahfidz record with ID ${id} not found`);
    }

    await this.prisma.tahfidzRecord.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Tahfidz record deleted successfully",
    };
  }

  async getBySantri(santriId: number) {
    // Validasi santri exists
    const santri = await this.prisma.santri.findUnique({
      where: { id: santriId },
    });

    if (!santri) {
      throw new NotFoundException(`Santri with ID ${santriId} not found`);
    }

    return this.prisma.tahfidzRecord.findMany({
      where: { santriId },
      include: {
        santri: {
          select: {
            id: true,
            name: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getOverviewStats() {
    const [
      totalRecords,
      totalSantri,
      averageScore,
      totalPages,
      juzDistribution,
      recentActivity,
    ] = await Promise.all([
      // Total records
      this.prisma.tahfidzRecord.count(),

      // Total unique santri with tahfidz records
      this.prisma.tahfidzRecord
        .groupBy({
          by: ["santriId"],
          _count: true,
        })
        .then((results) => results.length),

      // Average score (only from records with score)
      this.prisma.tahfidzRecord.aggregate({
        _avg: {
          score: true,
        },
        where: {
          score: {
            not: null,
          },
        },
      }),

      // Total pages memorized
      this.prisma.tahfidzRecord.aggregate({
        _sum: {
          pageEnd: true,
          pageStart: true,
        },
      }),

      // Juz distribution
      this.prisma.tahfidzRecord.groupBy({
        by: ["juz"],
        _count: {
          _all: true,
        },
        orderBy: {
          juz: "asc",
        },
      }),

      // Recent activity (last 7 days)
      this.prisma.tahfidzRecord.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
    ]);

    const totalPagesMemorized = totalPages._sum.pageEnd
      ? totalPages._sum.pageEnd -
        (totalPages._sum.pageStart || 0) +
        totalRecords
      : 0;

    return {
      totalRecords,
      totalSantri,
      averageScore: averageScore._avg.score
        ? Math.round(averageScore._avg.score * 10) / 10
        : 0,
      totalPagesMemorized,
      juzDistribution: juzDistribution.map((juz) => ({
        juz: juz.juz,
        count: juz._count._all,
      })),
      recentActivity,
    };
  }

  async getSantriStats(santriId: number) {
    // Validasi santri exists
    const santri = await this.prisma.santri.findUnique({
      where: { id: santriId },
    });

    if (!santri) {
      throw new NotFoundException(`Santri with ID ${santriId} not found`);
    }

    const [
      totalRecords,
      completedJuz,
      averageScore,
      totalPages,
      lastRecord,
      progressByJuz,
    ] = await Promise.all([
      // Total records for this santri
      this.prisma.tahfidzRecord.count({
        where: { santriId },
      }),

      // Completed juz (unique juz count)
      this.prisma.tahfidzRecord
        .groupBy({
          by: ["juz"],
          where: { santriId },
          _count: true,
        })
        .then((results) => results.length),

      // Average score for this santri
      this.prisma.tahfidzRecord.aggregate({
        _avg: {
          score: true,
        },
        where: {
          santriId,
          score: {
            not: null,
          },
        },
      }),

      // Total pages memorized
      this.prisma.tahfidzRecord.aggregate({
        _sum: {
          pageEnd: true,
          pageStart: true,
        },
        where: { santriId },
      }),

      // Last record
      this.prisma.tahfidzRecord.findFirst({
        where: { santriId },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          teacher: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),

      // Progress by juz
      this.prisma.tahfidzRecord.groupBy({
        by: ["juz"],
        where: { santriId },
        _sum: {
          pageEnd: true,
          pageStart: true,
        },
        orderBy: {
          juz: "asc",
        },
      }),
    ]);

    const totalPagesMemorized = totalPages._sum.pageEnd
      ? totalPages._sum.pageEnd -
        (totalPages._sum.pageStart || 0) +
        totalRecords
      : 0;

    const progressByJuzFormatted = progressByJuz.map((item) => ({
      juz: item.juz,
      pages: (item._sum.pageEnd || 0) - (item._sum.pageStart || 0) + 1,
      completion: Math.min(
        (((item._sum.pageEnd || 0) - (item._sum.pageStart || 0) + 1) / 20) *
          100,
        100
      ),
    }));

    return {
      santri: {
        id: santri.id,
        name: santri.name,
      },
      totalRecords,
      completedJuz,
      averageScore: averageScore._avg.score
        ? Math.round(averageScore._avg.score * 10) / 10
        : 0,
      totalPagesMemorized,
      lastRecord,
      progressByJuz: progressByJuzFormatted,
      progressPercentage: Math.min((completedJuz / 30) * 100, 100),
    };
  }

  async getRecent(limit: number = 10) {
    return this.prisma.tahfidzRecord.findMany({
      take: limit,
      include: {
        santri: {
          select: {
            id: true,
            name: true,
            gender: true,
          },
        },
        teacher: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}
