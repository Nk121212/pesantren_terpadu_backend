import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  Put,
  Delete,
  Patch,
  Query,
} from "@nestjs/common";
import { TahfidzService } from "./tahfidz.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { CreateTahfidzDto } from "./dto/create-tahfidz.dto";
import { UpdateTahfidzDto } from "./dto/update-tahfidz.dto";

@Controller("tahfidz")
@UseGuards(JwtAuthGuard, RolesGuard)
export class TahfidzController {
  constructor(private readonly service: TahfidzService) {}

  // GET ALL records with pagination and filters
  @Get()
  getAll(
    @Query("skip") skip?: string,
    @Query("take") take?: string,
    @Query("santriId") santriId?: string,
    @Query("juz") juz?: string,
    @Query("teacherId") teacherId?: string,
    @Query("startDate") startDate?: string,
    @Query("endDate") endDate?: string
  ) {
    const filters = {
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      santriId: santriId ? parseInt(santriId) : undefined,
      juz: juz ? parseInt(juz) : undefined,
      teacherId: teacherId ? parseInt(teacherId) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
    return this.service.getAll(filters);
  }

  // GET by ID
  @Get(":id")
  getById(@Param("id", ParseIntPipe) id: number) {
    return this.service.getById(id);
  }

  // GET by santri ID
  @Get("santri/:santriId")
  getBySantri(@Param("santriId", ParseIntPipe) santriId: number) {
    return this.service.getBySantri(santriId);
  }

  // CREATE new record
  @Roles(Role.TEACHER, Role.SUPERADMIN, Role.ADMIN)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@Body() dto: CreateTahfidzDto) {
    return this.service.createRecord(dto);
  }

  // UPDATE record
  @Roles(Role.TEACHER, Role.SUPERADMIN, Role.ADMIN)
  @Put(":id")
  @UsePipes(new ValidationPipe({ transform: true }))
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateTahfidzDto) {
    return this.service.updateRecord(id, dto);
  }

  // PARTIAL UPDATE (PATCH)
  @Roles(Role.TEACHER, Role.SUPERADMIN, Role.ADMIN)
  @Patch(":id")
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  partialUpdate(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: Partial<UpdateTahfidzDto>
  ) {
    return this.service.updateRecord(id, dto);
  }

  // DELETE record
  @Roles(Role.TEACHER, Role.SUPERADMIN, Role.ADMIN)
  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.service.deleteRecord(id);
  }

  // GET statistics
  @Get("stats/overview")
  getOverviewStats() {
    return this.service.getOverviewStats();
  }

  // GET stats by santri
  @Get("stats/santri/:santriId")
  getSantriStats(@Param("santriId", ParseIntPipe) santriId: number) {
    return this.service.getSantriStats(santriId);
  }

  // GET recent records
  @Get("recent/:limit?")
  getRecent(@Param("limit") limit?: string) {
    const take = limit ? parseInt(limit) : 10;
    return this.service.getRecent(take);
  }
}
