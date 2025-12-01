import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  Query,
  Patch,
} from "@nestjs/common";
import { AcademicService } from "./academic.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Controller("academic")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AcademicController {
  constructor(private readonly service: AcademicService) {}

  // Subjects
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
  @Post("subject")
  createSubject(@Body() dto: any) {
    return this.service.createSubject(dto);
  }

  @Get("subject")
  listSubjects(@Query("skip") skip = "0", @Query("take") take = "20") {
    return this.service.listSubjects(Number(skip), Number(take));
  }

  // Grades
  @Roles(Role.TEACHER, Role.SUPERADMIN)
  @Post("grade")
  createGrade(@Body() dto: any) {
    return this.service.createGrade(dto);
  }

  @Get("grades/santri/:santriId")
  getGrades(@Param("santriId", ParseIntPipe) santriId: number) {
    return this.service.getGrades(santriId);
  }

  // Attendance
  @Roles(Role.TEACHER, Role.SUPERADMIN, Role.ADMIN)
  @Post("attendance")
  createAttendance(@Body() dto: any) {
    return this.service.createAttendance(dto);
  }

  @Get("attendance/santri/:santriId")
  getAttendance(@Param("santriId", ParseIntPipe) santriId: number) {
    return this.service.getAttendance(santriId);
  }
}
