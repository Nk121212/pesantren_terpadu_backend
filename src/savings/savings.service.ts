import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSavingsDto } from "./dto/create-savings.dto";
import { CreateSavingsTransactionDto } from "./dto/create-savings-transaction.dto";
import { TransactionStatus, Role, Prisma } from "@prisma/client";

@Injectable()
export class SavingsService {
  constructor(private prisma: PrismaService) {}

  async createSavings(dto: CreateSavingsDto) {
    const exists = await this.prisma.savings.findUnique({
      where: { santriId: dto.santriId },
    });
    if (exists) return exists;

    return this.prisma.savings.create({
      data: { santriId: dto.santriId },
    });
  }

  async listAll() {
    return this.prisma.savings.findMany({
      include: { santri: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(id: number) {
    const s = await this.prisma.savings.findUnique({
      where: { id },
      include: { santri: true, transactions: true },
    });
    if (!s) throw new NotFoundException("Tabungan tidak ditemukan");
    return s;
  }

  async getBalance(santriId: number) {
    const savings = await this.prisma.savings.findUnique({
      where: { santriId },
    });
    if (!savings) throw new NotFoundException("Tabungan tidak ditemukan");
    return { santriId, balance: savings.balance };
  }

  async createTransaction(
    savingsId: number,
    dto: CreateSavingsTransactionDto,
    userId: number
  ) {
    // validate savings exists
    const savings = await this.prisma.savings.findUnique({
      where: { id: savingsId },
    });
    if (!savings) throw new NotFoundException("Tabungan tidak ditemukan");

    if (!["INCOME", "EXPENSE"].includes(dto.type as any)) {
      throw new BadRequestException("Type transaksi tidak valid");
    }
    if (dto.amount <= 0) {
      throw new BadRequestException("Amount harus lebih dari 0");
    }

    const created = await this.prisma.savingsTransaction.create({
      data: {
        savingsId,
        type: dto.type as any,
        amount: new Prisma.Decimal(dto.amount),
        description: dto.description,
        proofUrl: dto.proofUrl,
        createdBy: userId,
      },
    });

    // optionally: create audit trail
    await this.prisma.auditTrail.create({
      data: {
        module: "savings",
        recordId: created.id,
        action: "create_transaction",
        userId,
        note: dto.description || null,
      },
    });

    return created;
  }

  async approveTransaction(
    transactionId: number,
    userRole: Role,
    userId: number,
    approve: boolean
  ) {
    if (!(userRole === Role.ADMIN || userRole === Role.SUPERADMIN)) {
      throw new ForbiddenException(
        "Tidak memiliki akses untuk approve/reject transaksi"
      );
    }

    const tx = await this.prisma.savingsTransaction.findUnique({
      where: { id: transactionId },
    });
    if (!tx) throw new NotFoundException("Transaksi tidak ditemukan");

    if (tx.status !== TransactionStatus.PENDING) {
      throw new ForbiddenException("Transaksi sudah diproses");
    }

    const newStatus = approve
      ? TransactionStatus.APPROVED
      : TransactionStatus.REJECTED;

    return this.prisma.$transaction(async (pr) => {
      // if approve, update savings balance according to type
      if (approve) {
        const savings = await pr.savings.findUnique({
          where: { id: tx.savingsId },
        });
        if (!savings) throw new NotFoundException("Tabungan tidak ditemukan");

        let newBalance = new Prisma.Decimal(savings.balance);

        if (tx.type === "INCOME") newBalance = newBalance.plus(tx.amount);
        if (tx.type === "EXPENSE") {
          // ensure not negative (business rule)
          const result = newBalance.minus(tx.amount);
          if (result.isNegative()) {
            throw new BadRequestException(
              "Saldo tidak cukup untuk pengeluaran"
            );
          }
          newBalance = result;
        }

        await pr.savings.update({
          where: { id: savings.id },
          data: { balance: newBalance },
        });
      }

      const updatedTx = await pr.savingsTransaction.update({
        where: { id: transactionId },
        data: {
          status: newStatus,
          approvedBy: userId,
          approvedAt: new Date(),
        },
      });

      // audit trail
      await pr.auditTrail.create({
        data: {
          module: "savings",
          recordId: transactionId,
          action: approve ? "approve_transaction" : "reject_transaction",
          userId,
        },
      });

      return updatedTx;
    });
  }

  async listTransactions(savingsId: number) {
    // Validate savings exists
    const s = await this.prisma.savings.findUnique({
      where: { id: savingsId },
    });
    if (!s) throw new NotFoundException("Tabungan tidak ditemukan");

    return this.prisma.savingsTransaction.findMany({
      where: { savingsId },
      orderBy: { createdAt: "desc" },
    });
  }
}
