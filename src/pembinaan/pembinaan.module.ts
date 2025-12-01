import { Module } from "@nestjs/common";
import { PembinaanService } from "./pembinaan.service";
import { PembinaanController } from "./pembinaan.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [PembinaanController],
  providers: [PembinaanService, PrismaService],
})
export class PembinaanModule {}
