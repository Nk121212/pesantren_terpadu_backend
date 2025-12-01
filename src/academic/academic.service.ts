import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AcademicService {
  constructor(private prisma: PrismaService) {}

  async createSubject(dto: any) {
    return this.prisma.academicSubject.create({ data: dto });
  }

  async listSubjects(skip = 0, take = 20) {
    return this.prisma.academicSubject.findMany({ skip, take });
  }

  async createGrade(dto: any) {
    return this.prisma.academicGrade.create({ data: dto });
  }

  async getGrades(santriId: number) {
    return this.prisma.academicGrade.findMany({ where: { santriId } });
  }

  async createAttendance(dto: any) {
    return this.prisma.attendance.create({ data: dto });
  }

  async getAttendance(santriId: number) {
    return this.prisma.attendance.findMany({ where: { santriId } });
  }
}
