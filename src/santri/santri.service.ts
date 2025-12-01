import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSantriDto } from "./dto/create-santri.dto";
import { UpdateSantriDto } from "./dto/update-santri.dto";

@Injectable()
export class SantriService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateSantriDto) {
    try {
      // cek apakah santri dengan nama + guardian sudah ada
      const existing = await this.prisma.santri.findFirst({
        where: {
          name: data.name,
          guardianId: data.guardianId || null,
        },
      });

      if (existing) {
        throw new ConflictException("Santri dengan data ini sudah ada");
      }

      return await this.prisma.santri.create({
        data: {
          name: data.name,
          gender: data.gender,
          birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
          address: data.address,
          guardian: data.guardianId
            ? { connect: { id: data.guardianId } }
            : undefined,
        },
      });
    } catch (error) {
      console.error("SantriService.create error:", error);
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException("Failed to create santri");
    }
  }

  async findAll() {
    try {
      const santri = await this.prisma.santri.findMany({
        include: { guardian: true },
      });
      console.log("Santri fetched:", santri);
      return santri;
    } catch (error) {
      console.error("SantriService.findAll original error:", error);
      throw error; // lempar error asli tanpa bungkus
    }
  }

  async findOne(id: number) {
    try {
      const santri = await this.prisma.santri.findUnique({
        where: { id },
        include: { guardian: true },
      });

      if (!santri)
        throw new NotFoundException(`Santri with ID ${id} not found`);

      return santri;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      console.error("SantriService.findOne error:", error);
      throw new InternalServerErrorException("Failed to fetch santri");
    }
  }

  async update(id: number, data: UpdateSantriDto) {
    try {
      const updateData = {
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
      };

      return await this.prisma.santri.update({
        where: { id },
        data: updateData,
      });
    } catch (error) {
      console.error("SantriService.update error:", error);
      throw new InternalServerErrorException("Failed to update santri");
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.santri.delete({ where: { id } });
    } catch (error) {
      console.error("SantriService.remove error:", error);
      throw new InternalServerErrorException("Failed to delete santri");
    }
  }
}
