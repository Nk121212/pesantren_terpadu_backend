import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from "@nestjs/common";
import { CanteenService } from "./canteen.service";
import { CreateMerchantDto, CreateCanteenTxDto } from "./dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";

@Controller("canteen")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CanteenController {
  constructor(private readonly service: CanteenService) {}

  @Roles(Role.SUPERADMIN, Role.ADMIN)
  @Post("merchant")
  createMerchant(@Body() dto: CreateMerchantDto) {
    return this.service.createMerchant(dto);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.MERCHANT)
  @Get("merchant/:id")
  getMerchant(@Param("id", ParseIntPipe) id: number) {
    return this.service.getMerchant(id);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.MERCHANT)
  @Get("merchant")
  listMerchants(@Query("skip") skip = "0", @Query("take") take = "20") {
    return this.service.listMerchants(Number(skip), Number(take));
  }

  // create canteen transaction (santri pays merchant) - may need file proof
  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.MERCHANT, Role.STUDENT)
  @UseInterceptors(FileInterceptor("proof"))
  @Post("transaction")
  async createTransaction(
    @Body() dto: CreateCanteenTxDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (file) dto.proofUrl = `/uploads/${file.filename}`;
    return this.service.createTransaction(dto);
  }

  @Roles(Role.SUPERADMIN, Role.ADMIN, Role.MERCHANT)
  @Get("transactions/:merchantId")
  listTransactions(@Param("merchantId", ParseIntPipe) merchantId: number) {
    return this.service.listTransactions(merchantId);
  }
}
