import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMerchantDto, CreateCanteenTxDto } from "./dto";

@Injectable()
export class CanteenService {
  constructor(private prisma: PrismaService) {}

  async createMerchant(dto: CreateMerchantDto) {
    return this.prisma.merchant.create({ data: dto });
  }

  async getMerchant(id: number) {
    return this.prisma.merchant.findUnique({ where: { id } });
  }

  async listMerchants(skip = 0, take = 20) {
    return this.prisma.merchant.findMany({ skip, take });
  }

  async createTransaction(dto: CreateCanteenTxDto) {
    // simplified skeleton: implement full transaction/locking in real code
    const santriSavings = await this.prisma.savings.findUnique({
      where: { santriId: dto.santriId },
    });
    if (!santriSavings) throw new BadRequestException("Savings not found");

    if (santriSavings.balance.toNumber() < dto.amount) {
      throw new BadRequestException("Insufficient balance");
    }

    return this.prisma.$transaction(async (tx) => {
      // deduct savings -> create savings transaction
      const savingsTx = await tx.savingsTransaction.create({
        data: {
          savingsId: santriSavings.id,
          type: "EXPENSE",
          amount: dto.amount,
          description: `Canteen payment to merchant ${dto.merchantId}`,
          status: "APPROVED",
          createdBy: dto.createdBy ?? null,
        },
      });

      // create canteen transaction
      const canteenTx = await tx.canteenTransaction.create({
        data: {
          santriId: dto.santriId,
          merchantId: dto.merchantId,
          amount: dto.amount,
          description: dto.description,
          paymentMethod: dto.paymentMethod ?? "QRIS",
          status: "APPROVED",
          savingsTransactionId: savingsTx.id,
        },
      });

      // update balances
      await tx.savings.update({
        where: { id: santriSavings.id },
        data: { balance: { decrement: dto.amount as any } },
      });

      await tx.merchant.update({
        where: { id: dto.merchantId },
        data: { balance: { increment: dto.amount as any } },
      });

      return canteenTx;
    });
  }

  async listTransactions(merchantId: number) {
    return this.prisma.canteenTransaction.findMany({
      where: { merchantId },
      orderBy: { createdAt: "desc" },
    });
  }
}
