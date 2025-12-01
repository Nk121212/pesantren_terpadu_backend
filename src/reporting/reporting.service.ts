import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GetReportDto } from "./dto/get-report.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class ReportingService {
  constructor(private prisma: PrismaService) {}

  async getFinanceReport(dto: GetReportDto) {
    const { startDate, endDate } = dto;
    const where: any = { status: "APPROVED" };
    if (startDate) where.createdAt = { gte: new Date(startDate) };
    if (endDate)
      where.createdAt = { ...where.createdAt, lte: new Date(endDate) };

    const transactions = await this.prisma.finance.findMany({ where });

    const totalIncome = transactions
      .filter((t) => t.type === "INCOME")
      .reduce((acc, t) => acc + Number(t.amount), 0);

    const totalExpense = transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((acc, t) => acc + Number(t.amount), 0);

    return { totalIncome, totalExpense, transactions };
  }

  async getSavingsReport(dto: GetReportDto) {
    const { santriId } = dto;
    const where: any = {};
    if (santriId) where.santriId = santriId;

    const savings = await this.prisma.savings.findMany({
      where,
      include: { transactions: true, santri: true },
    });

    return savings.map((s) => ({
      santri: s.santri.name,
      balance: Number(s.balance),
      transactions: s.transactions,
    }));
  }

  async getPayrollReport(dto: GetReportDto) {
    const { startDate, endDate, staffId } = dto;
    const where: any = {};
    if (staffId) where.staffId = staffId;
    if (startDate || endDate) where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);

    const payrolls = await this.prisma.payroll.findMany({
      where,
      include: { staff: true, transactions: true },
    });

    return payrolls.map((p) => ({
      staff: p.staff.name,
      month: p.month,
      year: p.year,
      salary: Number(p.salary),
      transactions: p.transactions,
    }));
  }

  async getInvoiceReport(dto: GetReportDto) {
    const { santriId } = dto;
    const where: any = {};
    if (santriId) where.santriId = santriId;

    const invoices = await this.prisma.invoice.findMany({
      where,
      include: { payments: true, santri: true },
    });

    return invoices.map((i) => ({
      santri: i.santri.name,
      amount: i.amount,
      status: i.status,
      payments: i.payments,
    }));
  }

  async getPpdbReport(dto: GetReportDto) {
    const applicants = await this.prisma.ppdbApplicant.findMany({
      include: { documents: true },
    });

    return applicants.map((a) => ({
      name: a.name,
      status: a.status,
      paymentStatus: a.paymentStatus,
      documents: a.documents.map((d) => ({
        fileName: d.fileName,
        filePath: d.filePath,
      })),
    }));
  }

  async getDashboardSummary(dto: GetReportDto) {
    const { startDate, endDate } = dto;

    // Finance filter
    const financeWhere: any = { status: "APPROVED" };
    if (startDate) financeWhere.createdAt = { gte: new Date(startDate) };
    if (endDate)
      financeWhere.createdAt = {
        ...financeWhere.createdAt,
        lte: new Date(endDate),
      };

    const finance = await this.prisma.finance.findMany({ where: financeWhere });

    const totalIncome = finance
      .filter((f) => f.type === "INCOME")
      .reduce(
        (acc, f) => acc.add(new Prisma.Decimal(f.amount)),
        new Prisma.Decimal(0)
      );

    const totalExpense = finance
      .filter((f) => f.type === "EXPENSE")
      .reduce(
        (acc, f) => acc.add(new Prisma.Decimal(f.amount)),
        new Prisma.Decimal(0)
      );

    // Savings total
    const savings = await this.prisma.savings.findMany();
    const totalSavings = savings.reduce(
      (acc, s) => acc.add(new Prisma.Decimal(s.balance)),
      new Prisma.Decimal(0)
    );

    // Payroll total
    const payrollWhere: any = {};
    if (startDate || endDate) payrollWhere.createdAt = {};
    if (startDate) payrollWhere.createdAt.gte = new Date(startDate);
    if (endDate) payrollWhere.createdAt.lte = new Date(endDate);

    const payrolls = await this.prisma.payroll.findMany({
      where: payrollWhere,
    });
    const totalPayroll = payrolls.reduce(
      (acc, p) => acc.add(new Prisma.Decimal(p.salary)),
      new Prisma.Decimal(0)
    );

    // PPDB summary
    const totalApplicants = await this.prisma.ppdbApplicant.count();
    const totalAccepted = await this.prisma.ppdbApplicant.count({
      where: { status: "ACCEPTED" },
    });
    const totalRejected = await this.prisma.ppdbApplicant.count({
      where: { status: "REJECTED" },
    });

    return {
      finance: {
        totalIncome: totalIncome.toNumber(),
        totalExpense: totalExpense.toNumber(),
        net: totalIncome.minus(totalExpense).toNumber(),
      },
      savings: totalSavings.toNumber(),
      payroll: totalPayroll.toNumber(),
      ppdb: { totalApplicants, totalAccepted, totalRejected },
    };
  }
}
