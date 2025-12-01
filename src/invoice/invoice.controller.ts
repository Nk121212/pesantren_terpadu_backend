import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from "@nestjs/common";
import { InvoiceService } from "./invoice.service";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import { UpdateInvoiceDto } from "./dto/update-invoice.dto";

@Controller("invoices")
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  create(@Body() dto: CreateInvoiceDto) {
    return this.invoiceService.create(dto);
  }

  @Get()
  findAll() {
    return this.invoiceService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.invoiceService.findOne(+id);
  }

  @Get("santri/:santriId")
  findBySantri(@Param("santriId") santriId: string) {
    return this.invoiceService.findBySantri(+santriId);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateInvoiceDto) {
    return this.invoiceService.update(+id, dto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.invoiceService.remove(+id);
  }
}
