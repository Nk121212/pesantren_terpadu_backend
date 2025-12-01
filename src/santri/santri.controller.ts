import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
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
  async findOne(@Param("id") id: string) {
    return await this.santriService.findOne(Number(id));
  }

  @Roles("ADMIN", "SUPERADMIN", "STAFF")
  @Put(":id")
  async update(@Param("id") id: string, @Body() body: UpdateSantriDto) {
    return await this.santriService.update(+id, body);
  }

  @Roles("ADMIN", "SUPERADMIN")
  @Delete(":id")
  async remove(@Param("id") id: string) {
    return await this.santriService.remove(Number(id));
  }
}
