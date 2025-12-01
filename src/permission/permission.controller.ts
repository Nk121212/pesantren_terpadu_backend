import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { PermissionService } from "./permission.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Controller("permissions")
@UseGuards(JwtAuthGuard, RolesGuard)
export class PermissionController {
  constructor(private readonly service: PermissionService) {}

  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.STAFF)
  @Post()
  create(@Body() dto: any) {
    return this.service.createRequest(dto);
  }

  @Get()
  list() {
    return this.service.listRequests();
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Patch(":id/status")
  updateStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status") status: string
  ) {
    return this.service.updateStatus(id, status);
  }
}
