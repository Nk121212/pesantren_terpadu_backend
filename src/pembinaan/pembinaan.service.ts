import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePembinaanDto } from "./dto/create-pembinaan.dto";
import { UpdatePembinaanDto } from "./dto/update-pembinaan.dto";

@Injectable()
export class PembinaanService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePembinaanDto) {
    return this.prisma.pembinaanRecord.create({ data });
  }

  async findAll() {
    return this.prisma.pembinaanRecord.findMany({
      include: {
        santri: true,
        mentor: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: number) {
    const pembinaan = await this.prisma.pembinaanRecord.findUnique({
      where: { id },
      include: { santri: true, mentor: true },
    });
    if (!pembinaan)
      throw new NotFoundException("Data pembinaan tidak ditemukan");
    return pembinaan;
  }

  async update(id: number, data: UpdatePembinaanDto) {
    await this.findOne(id);
    return this.prisma.pembinaanRecord.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.pembinaanRecord.delete({ where: { id } });
  }
}
