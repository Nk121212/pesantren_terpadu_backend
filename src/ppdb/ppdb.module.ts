import { Module } from "@nestjs/common";
import { PpdbService } from "./ppdb.service";
import { PpdbController } from "./ppdb.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  providers: [PpdbService, PrismaService],
  controllers: [PpdbController],
})
export class PpdbModule {}
