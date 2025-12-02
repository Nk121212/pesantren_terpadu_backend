import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
  Put,
  Delete,
} from "@nestjs/common";
import { AcademicService } from "./academic.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "@prisma/client";
import {
  CreateSubjectDto,
  CreateGradeDto,
  CreateAttendanceDto,
  UpdateSubjectDto,
  UpdateGradeDto,
  UpdateAttendanceDto,
} from "./dto";

@Controller("academic")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AcademicController {
  constructor(private readonly service: AcademicService) {}

  // Subjects
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
  @Post("subject")
  createSubject(@Body() dto: CreateSubjectDto) {
    return this.service.createSubject(dto);
  }

  @Get("subject")
  listSubjects(@Query("skip") skip = "0", @Query("take") take = "20") {
    return this.service.listSubjects(Number(skip), Number(take));
  }

  @Get("subject/:id")
  getSubject(@Param("id", ParseIntPipe) id: number) {
    return this.service.getSubject(id);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
  @Put("subject/:id")
  updateSubject(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateSubjectDto
  ) {
    return this.service.updateSubject(id, dto);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Delete("subject/:id")
  deleteSubject(@Param("id", ParseIntPipe) id: number) {
    return this.service.deleteSubject(id);
  }

  // Grades
  @Roles(Role.TEACHER, Role.SUPERADMIN)
  @Post("grade")
  createGrade(@Body() dto: CreateGradeDto) {
    return this.service.createGrade(dto);
  }

  @Get("grades/santri/:santriId")
  getGrades(@Param("santriId", ParseIntPipe) santriId: number) {
    return this.service.getGrades(santriId);
  }

  @Get("grade/:id")
  getGrade(@Param("id", ParseIntPipe) id: number) {
    return this.service.getGrade(id);
  }

  @Roles(Role.TEACHER, Role.SUPERADMIN)
  @Put("grade/:id")
  updateGrade(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateGradeDto
  ) {
    return this.service.updateGrade(id, dto);
  }

  @Roles(Role.TEACHER, Role.SUPERADMIN)
  @Delete("grade/:id")
  deleteGrade(@Param("id", ParseIntPipe) id: number) {
    return this.service.deleteGrade(id);
  }

  // Attendance
  @Roles(Role.TEACHER, Role.SUPERADMIN, Role.ADMIN)
  @Post("attendance")
  createAttendance(@Body() dto: CreateAttendanceDto) {
    return this.service.createAttendance(dto);
  }

  @Get("attendance/santri/:santriId")
  getAttendance(@Param("santriId", ParseIntPipe) santriId: number) {
    return this.service.getAttendance(santriId);
  }

  @Get("attendance/:id")
  getAttendanceById(@Param("id", ParseIntPipe) id: number) {
    return this.service.getAttendanceById(id);
  }

  @Roles(Role.TEACHER, Role.SUPERADMIN, Role.ADMIN)
  @Put("attendance/:id")
  updateAttendance(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateAttendanceDto
  ) {
    return this.service.updateAttendance(id, dto);
  }

  @Roles(Role.TEACHER, Role.SUPERADMIN, Role.ADMIN)
  @Delete("attendance/:id")
  deleteAttendance(@Param("id", ParseIntPipe) id: number) {
    return this.service.deleteAttendance(id);
  }

  @Get("stats")
  async getStats() {
    return await this.service.getStats();
  }
}
