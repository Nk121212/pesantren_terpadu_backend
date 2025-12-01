import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";

@Injectable()
export class InvoiceService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateInvoiceDto) {
    return this.prisma.invoice.create({
      data: {
        santri: { connect: { id: data.santriId } },
        amount: data.amount,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        status: data.status,
      },
    });
  }

  async findAll() {
    return this.prisma.invoice.findMany({
      include: { santri: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: { santri: true },
    });
  }

  async findBySantri(santriId: number) {
    return this.prisma.invoice.findMany({
      where: { santriId },
      include: { santri: true },
    });
  }

  async update(id: number, data: UpdateInvoiceDto) {
    return this.prisma.invoice.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.invoice.delete({
      where: { id },
    });
  }
}
