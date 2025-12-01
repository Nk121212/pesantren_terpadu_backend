import { Module } from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { PaymentsController } from "./payments.controller";
import { PrismaService } from "../prisma/prisma.service";
import { FcmService } from "../common/services/fcm.service";

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsService, PrismaService, FcmService],
})
export class PaymentsModule {}
