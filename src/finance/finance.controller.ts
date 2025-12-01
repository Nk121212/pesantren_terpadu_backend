import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import {
  FinanceService,
  CreateTransactionDto,
  UpdateTransactionDto,
} from "./finance.service";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Role } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";

@Controller("finance")
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinanceController {
  constructor(private financeService: FinanceService) {}

  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.STAFF)
  @UseInterceptors(FileInterceptor("proof"))
  async create(
    @Body() dto: CreateTransactionDto,
    @UploadedFile() file: Express.Multer.File // <-- sekarang valid
  ) {
    if (file) dto.proofUrl = `/uploads/${file.filename}`;
    return this.financeService.createTransaction(dto);
  }

  @Get(":id")
  get(@Param("id", ParseIntPipe) id: number) {
    return this.financeService.getTransaction(id);
  }

  @Get()
  list(@Query("skip") skip = "0", @Query("take") take = "20") {
    return this.financeService.listTransactions(Number(skip), Number(take));
  }

  @Patch(":id")
  @Roles(Role.ADMIN, Role.SUPERADMIN, Role.STAFF)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateTransactionDto
  ) {
    return this.financeService.updateTransaction(id, dto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.financeService.deleteTransaction(id);
  }

  @Patch("approve/:id/:userId")
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  approve(
    @Param("id", ParseIntPipe) id: number,
    @Param("userId", ParseIntPipe) userId: number
  ) {
    return this.financeService.approveTransaction(id, userId);
  }

  @Patch("reject/:id/:userId")
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  reject(
    @Param("id", ParseIntPipe) id: number,
    @Param("userId", ParseIntPipe) userId: number
  ) {
    return this.financeService.rejectTransaction(id, userId);
  }
}
