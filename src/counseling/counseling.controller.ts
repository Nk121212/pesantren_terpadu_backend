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
} from "@nestjs/common";
import { CounselingService } from "./counseling.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Controller("counseling")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CounselingController {
  constructor(private readonly service: CounselingService) {}

  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.STAFF, Role.TEACHER)
  @Post()
  create(@Body() dto: any) {
    return this.service.createSession(dto);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.STAFF, Role.TEACHER)
  @Get()
  list(@Query("skip") skip = "0", @Query("take") take = "20") {
    return this.service.listSessions(Number(skip), Number(take));
  }

  @Get(":id")
  get(@Param("id", ParseIntPipe) id: number) {
    return this.service.getSession(id);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.STAFF)
  @Patch(":id/status")
  updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status") status: string
  ) {
    return this.service.updateStatus(id, status);
  }
}
