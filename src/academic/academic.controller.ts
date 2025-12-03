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
  Logger,
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
  private readonly logger = new Logger(AcademicController.name);

  constructor(private readonly service: AcademicService) {
    this.logger.log("AcademicController initialized");
  }

  // ==================== SUBJECTS ====================
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
  @Post("subject")
  createSubject(@Body() dto: CreateSubjectDto) {
    this.logger.log(`Creating subject: ${dto.name}`);
    return this.service.createSubject(dto);
  }

  @Get("subject")
  listSubjects(@Query("skip") skip = "0", @Query("take") take = "20") {
    this.logger.log(`Listing subjects - skip: ${skip}, take: ${take}`);
    return this.service.listSubjects(Number(skip), Number(take));
  }

  @Get("subject/:id")
  getSubject(@Param("id", ParseIntPipe) id: number) {
    this.logger.log(`Getting subject ID: ${id}`);
    return this.service.getSubject(id);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
  @Put("subject/:id")
  updateSubject(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateSubjectDto
  ) {
    this.logger.log(`Updating subject ID: ${id}`);
    return this.service.updateSubject(id, dto);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Delete("subject/:id")
  deleteSubject(@Param("id", ParseIntPipe) id: number) {
    this.logger.log(`Deleting subject ID: ${id}`);
    return this.service.deleteSubject(id);
  }

  // ==================== GRADES ====================
  @Roles(Role.TEACHER, Role.SUPERADMIN)
  @Post("grade")
  createGrade(@Body() dto: CreateGradeDto) {
    this.logger.log(
      `Creating grade for santri ${dto.santriId}, subject ${dto.subjectId}`
    );
    return this.service.createGrade(dto);
  }

  @Get("grade")
  listGrades(
    @Query("skip") skip = "0",
    @Query("take") take = "20",
    @Query("santriId") santriId?: string,
    @Query("subjectId") subjectId?: string,
    @Query("semester") semester?: string,
    @Query("year") year?: string
  ) {
    this.logger.log(`Listing grades - skip: ${skip}, take: ${take}`);

    const filters: any = {};

    if (santriId) {
      filters.santriId = Number(santriId);
    }

    if (subjectId) {
      filters.subjectId = Number(subjectId);
    }

    if (semester) {
      filters.semester = Number(semester);
    }

    if (year) {
      filters.year = Number(year);
    }

    return this.service.listGrades(Number(skip), Number(take), filters);
  }

  @Get("grades/santri/:santriId")
  getGrades(@Param("santriId", ParseIntPipe) santriId: number) {
    this.logger.log(`Getting grades for santri ID: ${santriId}`);
    return this.service.getGrades(santriId);
  }

  @Get("grade/:id")
  getGrade(@Param("id", ParseIntPipe) id: number) {
    this.logger.log(`Getting grade ID: ${id}`);
    return this.service.getGrade(id);
  }

  @Roles(Role.TEACHER, Role.SUPERADMIN)
  @Put("grade/:id")
  updateGrade(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateGradeDto
  ) {
    this.logger.log(`Updating grade ID: ${id}`);
    return this.service.updateGrade(id, dto);
  }

  @Roles(Role.TEACHER, Role.SUPERADMIN)
  @Delete("grade/:id")
  deleteGrade(@Param("id", ParseIntPipe) id: number) {
    this.logger.log(`Deleting grade ID: ${id}`);
    return this.service.deleteGrade(id);
  }

  // ==================== ATTENDANCE ====================
  @Roles(Role.TEACHER, Role.SUPERADMIN, Role.ADMIN)
  @Post("attendance")
  createAttendance(@Body() dto: CreateAttendanceDto) {
    this.logger.log(
      `Creating attendance for santri ${dto.santriId}, date: ${dto.date}`
    );
    return this.service.createAttendance(dto);
  }

  @Get("attendance/santri/:santriId")
  getAttendance(@Param("santriId", ParseIntPipe) santriId: number) {
    this.logger.log(`Getting attendance for santri ID: ${santriId}`);
    return this.service.getAttendance(santriId);
  }

  @Get("attendance/:id")
  getAttendanceById(@Param("id", ParseIntPipe) id: number) {
    this.logger.log(`Getting attendance ID: ${id}`);
    return this.service.getAttendanceById(id);
  }

  @Roles(Role.TEACHER, Role.SUPERADMIN, Role.ADMIN)
  @Put("attendance/:id")
  updateAttendance(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateAttendanceDto
  ) {
    this.logger.log(`Updating attendance ID: ${id}`);
    return this.service.updateAttendance(id, dto);
  }

  @Roles(Role.TEACHER, Role.SUPERADMIN, Role.ADMIN)
  @Delete("attendance/:id")
  deleteAttendance(@Param("id", ParseIntPipe) id: number) {
    this.logger.log(`Deleting attendance ID: ${id}`);
    return this.service.deleteAttendance(id);
  }

  @Get("attendance")
  listAttendance(
    @Query("skip") skip = "0",
    @Query("take") take = "20",
    @Query("search") search?: string,
    @Query("date") date?: string,
    @Query("status") status?: string,
    @Query("santriId") santriId?: string
  ) {
    this.logger.log(`Listing attendance - skip: ${skip}, take: ${take}`);

    const filters: any = {};

    if (search) {
      filters.search = search;
    }

    if (date) {
      filters.date = date;
    }

    if (status && status !== "all") {
      filters.status = status;
    }

    if (santriId) {
      filters.santriId = Number(santriId);
    }

    return this.service.listAttendance(Number(skip), Number(take), filters);
  }

  @Get("stats")
  async getStats() {
    this.logger.log("Getting academic stats");
    return await this.service.getStats();
  }
}
