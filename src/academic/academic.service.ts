import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateSubjectDto,
  CreateGradeDto,
  CreateAttendanceDto,
  UpdateSubjectDto,
  UpdateGradeDto,
  UpdateAttendanceDto,
} from "./dto";

@Injectable()
export class AcademicService {
  constructor(private prisma: PrismaService) {}

  // Subject Methods
  async createSubject(dto: CreateSubjectDto) {
    return this.prisma.academicSubject.create({ data: dto });
  }

  async listSubjects(skip = 0, take = 20) {
    return this.prisma.academicSubject.findMany({
      skip,
      take,
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getSubject(id: number) {
    const subject = await this.prisma.academicSubject.findUnique({
      where: { id },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        grades: {
          take: 10,
          include: {
            santri: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }

    return subject;
  }

  async updateSubject(id: number, dto: UpdateSubjectDto) {
    try {
      return await this.prisma.academicSubject.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Subject with ID ${id} not found`);
      }
      throw error;
    }
  }

  async deleteSubject(id: number) {
    try {
      return await this.prisma.academicSubject.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Subject with ID ${id} not found`);
      }
      throw error;
    }
  }

  // Grade Methods
  async createGrade(dto: CreateGradeDto) {
    return this.prisma.academicGrade.create({ data: dto });
  }

  async getGrades(santriId: number) {
    return this.prisma.academicGrade.findMany({
      where: { santriId },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
          },
        },
        santri: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        year: "desc",
      },
    });
  }

  async getGrade(id: number) {
    const grade = await this.prisma.academicGrade.findUnique({
      where: { id },
      include: {
        subject: true,
        santri: true,
      },
    });

    if (!grade) {
      throw new NotFoundException(`Grade with ID ${id} not found`);
    }

    return grade;
  }

  async updateGrade(id: number, dto: UpdateGradeDto) {
    try {
      return await this.prisma.academicGrade.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Grade with ID ${id} not found`);
      }
      throw error;
    }
  }

  async deleteGrade(id: number) {
    try {
      return await this.prisma.academicGrade.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Grade with ID ${id} not found`);
      }
      throw error;
    }
  }

  // Attendance Methods
  async createAttendance(dto: CreateAttendanceDto) {
    return this.prisma.attendance.create({ data: dto });
  }

  async getAttendance(santriId: number) {
    return this.prisma.attendance.findMany({
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
        date: "desc",
      },
    });
  }

  async getAttendanceById(id: number) {
    const attendance = await this.prisma.attendance.findUnique({
      where: { id },
      include: {
        santri: true,
        teacher: true,
      },
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    return attendance;
  }

  async updateAttendance(id: number, dto: UpdateAttendanceDto) {
    try {
      return await this.prisma.attendance.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Attendance with ID ${id} not found`);
      }
      throw error;
    }
  }

  async deleteAttendance(id: number) {
    try {
      return await this.prisma.attendance.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new NotFoundException(`Attendance with ID ${id} not found`);
      }
      throw error;
    }
  }

  async getStats() {
    try {
      const [totalSubjects, totalGrades, totalAttendance] = await Promise.all([
        this.prisma.academicSubject.count(),
        this.prisma.academicGrade.count(),
        this.prisma.attendance.count(),
      ]);

      // Calculate average score
      const grades = await this.prisma.academicGrade.findMany({
        select: { score: true },
      });

      const averageScore =
        grades.length > 0
          ? grades.reduce((acc, grade) => acc + grade.score, 0) / grades.length
          : 0;

      return {
        success: true,
        data: {
          totalSubjects,
          totalGrades,
          totalAttendance,
          averageScore,
        },
      };
    } catch (error) {
      console.error("Error fetching academic stats:", error);
      return {
        success: false,
        error: "Failed to fetch academic stats",
      };
    }
  }
}
