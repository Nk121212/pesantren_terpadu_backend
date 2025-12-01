import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PermissionStatus } from "@prisma/client";

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async createRequest(dto: any) {
    return this.prisma.permissionRequest.create({ data: dto });
  }

  async listRequests() {
    return this.prisma.permissionRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async updateStatus(id: number, status: string) {
    return this.prisma.permissionRequest.update({
      where: { id },
      data: { status: status as PermissionStatus },
    });
  }
}
