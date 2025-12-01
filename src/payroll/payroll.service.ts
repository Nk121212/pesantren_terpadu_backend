import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePayrollDto } from "./dto/create-payroll.dto";
import { CreatePayrollTransactionDto } from "./dto/create-payroll-transaction.dto";
import { UpdatePayrollTransactionStatusDto } from "./dto/update-payroll-transaction-status.dto";
import { TransactionStatus, Role } from "@prisma/client";

@Injectable()
export class PayrollService {
  constructor(private prisma: PrismaService) {}

  async createPayroll(dto: CreatePayrollDto) {
    return this.prisma.payroll.create({
      data: dto,
    });
  }

  async createTransaction(
    payrollId: number,
    dto: CreatePayrollTransactionDto,
    userId: number
  ) {
    return this.prisma.payrollTransaction.create({
      data: {
        payrollId,
        type: dto.type,
        amount: dto.amount,
        description: dto.description,
        proofUrl: dto.proofUrl,
        createdBy: userId,
      },
    });
  }

  async approveTransaction(
    transactionId: number,
    userRole: Role,
    userId: number,
    approve: boolean
  ) {
    // Ubah pemeriksaan role menjadi string comparison
    if (
      ![Role.ADMIN.toString(), Role.SUPERADMIN.toString()].includes(
        userRole.toString()
      )
    ) {
      throw new ForbiddenException("Tidak memiliki akses untuk approve/reject");
    }

    const tx = await this.prisma.payrollTransaction.findUnique({
      where: { id: transactionId },
    });
    if (!tx) throw new NotFoundException("Transaksi tidak ditemukan");

    if (tx.status !== TransactionStatus.PENDING) {
      throw new ForbiddenException("Transaksi sudah diproses");
    }

    const newStatus = approve
      ? TransactionStatus.APPROVED
      : TransactionStatus.REJECTED;

    return this.prisma.payrollTransaction.update({
      where: { id: transactionId },
      data: {
        status: newStatus,
        approvedBy: userId,
        approvedAt: new Date(),
      },
    });
  }

  async listTransactions(payrollId: number) {
    return this.prisma.payrollTransaction.findMany({
      where: { payrollId },
      orderBy: { createdAt: "desc" },
    });
  }

  async getPayroll(id: number) {
    return this.prisma.payroll.findUnique({ where: { id } });
  }

  async listPayrolls(skip = 0, take = 20) {
    return this.prisma.payroll.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  }
}
