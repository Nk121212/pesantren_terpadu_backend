import { TransactionType } from "@prisma/client";

export class CreatePayrollTransactionDto {
  type: TransactionType;
  amount: number;
  description?: string;
  proofUrl?: string;
}
