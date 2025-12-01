import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export type TransactionType = "INCOME" | "EXPENSE";

export interface CreateTransactionDto {
  type: TransactionType;
  category: string;
  amount: number;
  description?: string;
  proofUrl?: string;
  createdBy?: number; // user id
}

export interface UpdateTransactionDto {
  category?: string;
  amount?: number;
  description?: string;
  proofUrl?: string;
}

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async createTransaction(dto: CreateTransactionDto) {
    return this.prisma.finance.create({
      data: {
        type: dto.type,
        category: dto.category,
        amount: dto.amount,
        description: dto.description,
        proofUrl: dto.proofUrl,
        createdBy: dto.createdBy,
      },
    });
  }

  async getTransaction(id: number) {
    return this.prisma.finance.findUnique({ where: { id } });
  }

  async listTransactions(skip = 0, take = 20) {
    return this.prisma.finance.findMany({
      skip,
      take,
      orderBy: { createdAt: "desc" },
    });
  }

  async updateTransaction(id: number, dto: UpdateTransactionDto) {
    return this.prisma.finance.update({
      where: { id },
      data: { ...dto },
    });
  }

  async deleteTransaction(id: number) {
    return this.prisma.finance.delete({ where: { id } });
  }

  async approveTransaction(id: number, userId: number) {
    return this.prisma.finance.update({
      where: { id },
      data: { status: "APPROVED", approvedBy: userId, approvedAt: new Date() },
    });
  }

  async rejectTransaction(id: number, userId: number) {
    return this.prisma.finance.update({
      where: { id },
      data: { status: "REJECTED", approvedBy: userId, approvedAt: new Date() },
    });
  }

  // Integrasi Payment
  async logPaymentToFinance(payment: any) {
    if (payment.status !== "SUCCESS") return null;

    return this.createTransaction({
      type: "INCOME",
      category: "Payment",
      amount: Number(payment.amount),
      description: `Pembayaran Invoice #${payment.invoiceId}`,
      proofUrl: payment.proofUrl,
      createdBy: payment.userId,
    });
  }

  // Integrasi Penggajian
  async logSalaryToFinance(salary: any) {
    return this.createTransaction({
      type: "EXPENSE",
      category: "Gaji",
      amount: Number(salary.total),
      description: `Pembayaran gaji ${salary.userName} bulan ${salary.month}`,
      createdBy: salary.userId,
    });
  }
}
