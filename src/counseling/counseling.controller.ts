import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  UseGuards,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CounselingService } from "./counseling.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { CreateCounselingSessionDto } from "./dto/create-counseling-session.dto";
import { UpdateCounselingStatusDto } from "./dto/update-counseling-status.dto";
import { QueryCounselingDto } from "./dto/query-counseling.dto";

@Controller("counseling")
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ transform: true }))
export class CounselingController {
  constructor(private readonly service: CounselingService) {}

  // =========================
  // 📊 STATS (HARUS PALING ATAS)
  // =========================
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.STAFF, Role.TEACHER)
  @Get("stats")
  getStats() {
    return this.service.getStats();
  }

  // =========================
  // ➕ CREATE
  // =========================
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.STAFF, Role.TEACHER)
  @Post()
  create(@Body() dto: CreateCounselingSessionDto) {
    return this.service.createSession(dto);
  }

  // =========================
  // 📄 LIST
  // =========================
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.STAFF, Role.TEACHER)
  @Get()
  list(@Query() query: QueryCounselingDto) {
    return this.service.listSessions(query.skip, query.take);
  }

  // =========================
  // 📄 DETAIL (ID HARUS TERAKHIR)
  // =========================
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.STAFF, Role.TEACHER)
  @Get(":id")
  get(@Param("id", ParseIntPipe) id: number) {
    return this.service.getSession(id);
  }

  // =========================
  // 🔄 UPDATE STATUS
  // =========================
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.STAFF)
  @Patch(":id/status")
  updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateCounselingStatusDto
  ) {
    return this.service.updateStatus(id, dto.status);
  }
}
