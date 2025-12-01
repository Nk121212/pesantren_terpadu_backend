import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Request,
  Patch,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  BadRequestException,
} from "@nestjs/common";
import { SavingsService } from "./savings.service";
import { CreateSavingsDto } from "./dto/create-savings.dto";
import { CreateSavingsTransactionDto } from "./dto/create-savings-transaction.dto";
import { ApproveTransactionDto } from "./dto/approve-transaction.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { diskStorage } from "multer";
import { extname } from "path";

@Controller("savings")
@UseGuards(JwtAuthGuard, RolesGuard)
export class SavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  // create savings (admin only)
  @Post()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  async create(@Body() dto: CreateSavingsDto) {
    return this.savingsService.createSavings(dto);
  }

  // (optional) list all savings - admin
  @Get()
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  async listAll() {
    return this.savingsService.listAll();
  }

  // get savings by id
  @Get(":id")
  async getById(@Param("id", ParseIntPipe) id: number) {
    return this.savingsService.getById(id);
  }

  // get balance by santri id
  @Get("balance/:santriId")
  async getBalance(@Param("santriId", ParseIntPipe) santriId: number) {
    return this.savingsService.getBalance(santriId);
  }

  // create transaction (with optional proof upload)
  @Post("transaction/:savingsId")
  @UseInterceptors(
    FileInterceptor("proof", {
      storage: diskStorage({
        destination: "./uploads/savings",
        filename: (req, file, cb) => {
          const random = Date.now();
          const ext = extname(file.originalname);
          cb(null, `proof-${random}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    })
  )
  async createTransaction(
    @Param("savingsId", ParseIntPipe) savingsId: number,
    @Body() dto: CreateSavingsTransactionDto,
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any
  ) {
    if (file) {
      dto.proofUrl = `/uploads/savings/${file.filename}`;
    }
    // service will validate savings exists, etc.
    return this.savingsService.createTransaction(
      savingsId,
      dto,
      req.user.userId
    );
  }

  // list transactions for savings
  @Get("transaction/:savingsId")
  async listTransactions(@Param("savingsId", ParseIntPipe) savingsId: number) {
    return this.savingsService.listTransactions(savingsId);
  }

  // approve/reject transaction (admin)
  @Patch("transaction/:transactionId/approve")
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  async approveTransaction(
    @Param("transactionId", ParseIntPipe) transactionId: number,
    @Body() body: ApproveTransactionDto,
    @Request() req: any
  ) {
    return this.savingsService.approveTransaction(
      transactionId,
      req.user.role,
      req.user.userId,
      body.approve
    );
  }
}
