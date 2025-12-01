import { Module } from "@nestjs/common";
import { FinanceService } from "./finance.service";
import { FinanceController } from "./finance.controller";
import { PrismaService } from "../prisma/prisma.service";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  ],
  controllers: [FinanceController],
  providers: [FinanceService, PrismaService],
  exports: [FinanceService],
})
export class FinanceModule {}
