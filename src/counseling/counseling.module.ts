import { Module } from "@nestjs/common";
import { CounselingService } from "./counseling.service";
import { CounselingController } from "./counseling.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [CounselingService],
  controllers: [CounselingController],
})
export class CounselingModule {}
