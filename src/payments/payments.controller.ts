import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { PaymentsService } from "./payments.service";
import { CreatePaymentDto } from "./dto/create-payment.dto";
import { UpdatePaymentDto } from "./dto/update-payment.dto";
import { PaymentMethod } from "@prisma/client";
import { CreateRecurringInvoiceDto } from "./dto/create-recurring-invoice.dto";

@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(dto);
  }

  @Get(":id")
  get(@Param("id", ParseIntPipe) id: number) {
    return this.paymentsService.getPayment(id);
  }

  @Get("invoice/:invoiceId")
  getByInvoice(@Param("invoiceId", ParseIntPipe) invoiceId: number) {
    return this.paymentsService.getPaymentsByInvoice(invoiceId);
  }

  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdatePaymentDto) {
    return this.paymentsService.updatePayment(id, dto);
  }

  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.paymentsService.deletePayment(id);
  }

  // Endpoint webhook Duitku
  @Post("webhook")
  webhook(@Body() payload: any) {
    // Hanya kirim payload
    return this.paymentsService.handleDuitkuWebhook(payload);
  }

  // Endpoint untuk initiate Duitku payment
  @Post("duitku/:invoiceId/:method")
  createDuitkuPayment(
    @Param("invoiceId", ParseIntPipe) invoiceId: number,
    @Param("method") method: PaymentMethod,
    @Body("amount") amount: number
  ) {
    return this.paymentsService.createDuitkuPayment(invoiceId, amount, method);
  }

  @Post("recurring")
  createRecurringInvoice(@Body() dto: CreateRecurringInvoiceDto) {
    return this.paymentsService.generateRecurringInvoice(dto);
  }
}
