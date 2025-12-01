import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import { PayrollService } from "./payroll.service";
import { CreatePayrollDto } from "./dto/create-payroll.dto";
import { CreatePayrollTransactionDto } from "./dto/create-payroll-transaction.dto";
import { UpdatePayrollTransactionStatusDto } from "./dto/update-payroll-transaction-status.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Role } from "@prisma/client";
import { Req } from "@nestjs/common";

@Controller("payroll")
@UseGuards(JwtAuthGuard, RolesGuard)
export class PayrollController {
  constructor(private payrollService: PayrollService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  createPayroll(@Body() dto: CreatePayrollDto) {
    return this.payrollService.createPayroll(dto);
  }

  @Get(":id")
  getPayroll(@Param("id", ParseIntPipe) id: number) {
    return this.payrollService.getPayroll(id);
  }

  @Get()
  listPayrolls(@Query("skip") skip = "0", @Query("take") take = "20") {
    return this.payrollService.listPayrolls(Number(skip), Number(take));
  }

  @Post("transaction/:payrollId")
  @UseInterceptors(FileInterceptor("proof"))
  createTransaction(
    @Param("payrollId", ParseIntPipe) payrollId: number,
    @Body() dto: CreatePayrollTransactionDto,
    @UploadedFile() file: Express.Multer.File,
    @Body("userId") userId: number
  ) {
    if (file) dto.proofUrl = `/uploads/${file.filename}`;
    return this.payrollService.createTransaction(payrollId, dto, userId);
  }

  @Patch("transaction/:transactionId/approve")
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  approveTransaction(
    @Param("transactionId", ParseIntPipe) transactionId: number,
    @Body("approve") approve: boolean,
    @Req() req: any
  ) {
    return this.payrollService.approveTransaction(
      transactionId,
      req.user.role,
      req.user.userId,
      approve
    );
  }

  @Get("transactions/:payrollId")
  listTransactions(@Param("payrollId", ParseIntPipe) payrollId: number) {
    return this.payrollService.listTransactions(payrollId);
  }
}
