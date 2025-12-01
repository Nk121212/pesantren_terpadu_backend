import { Module } from "@nestjs/common";
import { AuditTrailService } from "./audit-trail.service";
import { AuditTrailController } from "./audit-trail.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  controllers: [AuditTrailController],
  providers: [AuditTrailService, PrismaService],
  exports: [AuditTrailService],
})
export class AuditTrailModule {}
