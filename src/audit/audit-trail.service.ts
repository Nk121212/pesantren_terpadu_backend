// src/audit/audit-trail.service.ts
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateAuditDto } from "./dto/create-audit.dto";

@Injectable()
export class AuditTrailService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateAuditDto) {
    return this.prisma.auditTrail.create({ data });
  }

  async findAll() {
    return this.prisma.auditTrail.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async log(params: {
    module: string;
    action: string;
    recordId?: number | null;
    userId?: number | null;
    note?: string | null;
  }) {
    const {
      module,
      action,
      recordId = null,
      userId = null,
      note = null,
    } = params;
    return this.prisma.auditTrail.create({
      data: {
        module,
        action,
        recordId,
        userId,
        note,
      },
    });
  }

  async findByModule(module: string) {
    return this.prisma.auditTrail.findMany({
      where: { module },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  }
}
