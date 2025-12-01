import { Module } from "@nestjs/common";
import { AcademicService } from "./academic.service";
import { AcademicController } from "./academic.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [AcademicService],
  controllers: [AcademicController],
})
export class AcademicModule {}
