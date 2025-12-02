import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  HttpStatus,
  ParseIntPipe,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { SantriService } from "./santri.service";
import { CreateSantriDto } from "./dto/create-santri.dto";
import { UpdateSantriDto } from "./dto/update-santri.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";

@Controller("santri")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SantriController {
  constructor(private readonly santriService: SantriService) {}

  @Roles("ADMIN", "SUPERADMIN", "STAFF")
  @Post()
  async create(@Body() dto: CreateSantriDto) {
    return await this.santriService.create(dto);
  }

  @Roles("ADMIN", "SUPERADMIN", "STAFF")
  @Get()
  async findAll() {
    return await this.santriService.findAll();
  }

  @Roles("ADMIN", "SUPERADMIN", "STAFF")
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    const santri = await this.santriService.findOne(id);

    if (!santri) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Santri dengan ID ${id} tidak ditemukan`,
        error: "Not Found",
      });
    }

    return santri;
  }

  @Roles("ADMIN", "SUPERADMIN", "STAFF")
  @Put(":id")
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateSantriDto
  ) {
    // Cek apakah santri ada
    const existingSantri = await this.santriService.findOne(id);
    if (!existingSantri) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Santri dengan ID ${id} tidak ditemukan`,
        error: "Not Found",
      });
    }

    return await this.santriService.update(id, body);
  }

  @Roles("ADMIN", "SUPERADMIN")
  @Delete(":id")
  async remove(@Param("id", ParseIntPipe) id: number) {
    // Cek apakah santri ada
    const existingSantri = await this.santriService.findOne(id);
    if (!existingSantri) {
      throw new NotFoundException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Santri dengan ID ${id} tidak ditemukan`,
        error: "Not Found",
      });
    }

    try {
      await this.santriService.remove(id);

      return {
        statusCode: HttpStatus.OK,
        message: "Santri berhasil dihapus",
      };
    } catch (error) {
      // Handle foreign key constraint error
      if (error.code === "P2003") {
        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message:
            "Santri tidak dapat dihapus karena memiliki data terkait (invoice, tabungan, absensi, dll).",
          error: "Conflict",
          details: {
            constraint: error.meta?.constraint,
            suggestion:
              "Hapus data terkait terlebih dahulu atau hubungi administrator.",
          },
        });
      }
      throw error;
    }
  }
}
