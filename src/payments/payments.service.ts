import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { CreateRecurringInvoiceDto } from "./dto/create-recurring-invoice.dto";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import axios from "axios";
import { Cron, CronExpression } from "@nestjs/schedule";
import { FcmService } from "../common/services/fcm.service"; // contoh service FCM

interface DuitkuResponse {
  statusCode: string;
  paymentUrl?: string;
  reference?: string;
  [key: string]: any;
}

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService, private fcmService: FcmService) {}

  // ============================
  // Create Payment
  // ============================
  async createPayment(dto: CreatePaymentDto) {
    const payment = await this.prisma.payment.create({
      data: {
        invoiceId: dto.invoiceId,
        amount: dto.amount,
        method: dto.method || PaymentMethod.BANK_TRANSFER,
        status: dto.status || PaymentStatus.PENDING,
        paidAt: dto.status === PaymentStatus.SUCCESS ? new Date() : null,
      },
    });

    if (payment.status === PaymentStatus.SUCCESS) {
      // update invoice status
      await this.updateInvoiceStatus(payment.invoiceId);
    }

    return payment;
  }

  async getPayment(id: number) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: { invoice: true },
    });
  }

  async getPaymentsByInvoice(invoiceId: number) {
    return this.prisma.payment.findMany({
      where: { invoiceId },
    });
  }

  async updatePayment(id: number, dto: UpdatePaymentDto) {
    const payment = await this.prisma.payment.update({
      where: { id },
      data: {
        amount: dto.amount,
        method: dto.method,
        status: dto.status,
        paidAt: dto.status === PaymentStatus.SUCCESS ? new Date() : undefined,
      },
    });

    if (dto.status === PaymentStatus.SUCCESS) {
      await this.updateInvoiceStatus(payment.invoiceId);
    }

    return payment;
  }

  async deletePayment(id: number) {
    return this.prisma.payment.delete({ where: { id } });
  }

  // ============================
  // Update Invoice Status
  // ============================
  private async updateInvoiceStatus(invoiceId: number) {
    const payments = await this.prisma.payment.findMany({
      where: { invoiceId, status: PaymentStatus.SUCCESS },
    });

    const invoice = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) return;

    const totalPaid = payments.reduce((sum, p) => sum + Number(p.amount), 0);

    let newStatus = invoice.status;
    if (totalPaid >= Number(invoice.amount)) {
      newStatus = "PAID";
    } else if (totalPaid > 0) {
      newStatus = "PARTIAL";
    }

    await this.prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: newStatus },
    });
  }

  // ============================
  // Duitku Payment
  // ============================
  async createDuitkuPayment(
    invoiceId: number,
    amount: number,
    method: PaymentMethod
  ) {
    const url = "https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry"; // contoh sandbox
    const payload = {
      merchantCode: process.env.DUITKU_MERCHANT_CODE,
      paymentAmount: amount,
      paymentMethod: method,
      merchantOrderId: invoiceId,
    };

    const resp = await axios.post<DuitkuResponse>(url, payload, {
      headers: { "Content-Type": "application/json" },
    });

    const data = resp.data;

    if (!data || data.statusCode !== "00") {
      throw new Error("Payment initiation failed");
    }

    return {
      paymentUrl: data.paymentUrl,
      reference: data.reference,
    };
  }

  // ============================
  // Duitku Webhook
  // ============================
  async handleDuitkuWebhook(payload: any) {
    const { merchantOrderId, statusCode, paymentAmount } = payload;

    const invoiceId = Number(merchantOrderId);
    const status =
      statusCode === "00" ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;

    // simpan payment
    const payment = await this.prisma.payment.create({
      data: {
        invoiceId,
        amount: Number(paymentAmount),
        method: PaymentMethod.BANK_TRANSFER, // bisa sesuaikan
        status,
        paidAt: status === PaymentStatus.SUCCESS ? new Date() : null,
      },
    });

    if (status === PaymentStatus.SUCCESS) {
      await this.updateInvoiceStatus(invoiceId);
    }

    return { success: true };
  }

  // ============================
  // Recurring Invoice
  // ============================
  async generateRecurringInvoice(dto: CreateRecurringInvoiceDto) {
    const dueDateStr = dto.dueDate || new Date().toISOString().split("T")[0];

    const invoice = await this.prisma.invoice.create({
      data: {
        santriId: dto.santriId,
        amount: dto.amount,
        description: dto.description,
        dueDate: new Date(dueDateStr),
        status: "PENDING",
      },
    });

    const santri = await this.prisma.santri.findUnique({
      where: { id: dto.santriId },
      include: { guardian: true },
    });

    if (santri?.guardian?.id) {
      await this.sendInvoiceNotification(santri.guardian.id, invoice);
    }

    return invoice;
  }

  private async sendInvoiceNotification(userId: number, invoice: any) {
    const guardian = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!guardian) return;

    await this.fcmService.sendNotification({
      userId,
      title: "Tagihan Baru",
      body: `Terdapat tagihan baru sebesar Rp${invoice.amount} untuk ${invoice.description}`,
    });
  }

  // ============================
  // Cron Jobs
  // ============================
  @Cron(CronExpression.EVERY_6_MONTHS)
  async generateMonthlyInvoices() {
    const santris = await this.prisma.santri.findMany();

    for (const s of santris) {
      await this.generateRecurringInvoice({
        santriId: s.id,
        amount: 500_000,
        description: "SPP Bulanan",
        dueDate: new Date(new Date().setDate(25)).toISOString().split("T")[0],
      });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async reminderPendingInvoices() {
    const today = new Date();
    const pendingInvoices = await this.prisma.invoice.findMany({
      where: { status: "PENDING", dueDate: { lte: today } },
      include: { santri: { include: { guardian: true } } },
    });

    for (const invoice of pendingInvoices) {
      if (invoice.santri?.guardian?.id) {
        await this.fcmService.sendNotification({
          userId: invoice.santri.guardian.id,
          title: "Reminder Tagihan",
          body: `Tagihan Rp${invoice.amount} (${invoice.description}) sudah jatuh tempo.`,
        });
      }
    }
  }
}
