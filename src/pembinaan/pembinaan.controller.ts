import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";
import { PembinaanService } from "./pembinaan.service";
import { CreatePembinaanDto } from "./dto/create-pembinaan.dto";
import { UpdatePembinaanDto } from "./dto/update-pembinaan.dto";

@Controller("pembinaan")
export class PembinaanController {
  constructor(private readonly pembinaanService: PembinaanService) {}

  @Post()
  create(@Body() dto: CreatePembinaanDto) {
    return this.pembinaanService.create(dto);
  }

  @Get()
  findAll() {
    return this.pembinaanService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.pembinaanService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdatePembinaanDto) {
    return this.pembinaanService.update(+id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.pembinaanService.remove(+id);
  }
}
