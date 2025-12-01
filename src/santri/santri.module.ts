import { Module } from "@nestjs/common";
import { SantriService } from "./santri.service";
import { SantriController } from "./santri.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [SantriController],
  providers: [SantriService],
})
export class SantriModule {}
