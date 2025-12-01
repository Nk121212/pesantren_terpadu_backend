import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { TahfidzService } from "./tahfidz.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Controller("tahfidz")
@UseGuards(JwtAuthGuard, RolesGuard)
export class TahfidzController {
  constructor(private readonly service: TahfidzService) {}

  @Roles(Role.TEACHER, Role.SUPERADMIN, Role.ADMIN)
  @Post()
  create(@Body() dto: any) {
    return this.service.createRecord(dto);
  }

  @Get("santri/:santriId")
  getBySantri(@Param("santriId", ParseIntPipe) santriId: number) {
    return this.service.getBySantri(santriId);
  }
}
