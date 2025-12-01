import { Module } from "@nestjs/common";
import { CanteenService } from "./canteen.service";
import { CanteenController } from "./canteen.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [CanteenService],
  controllers: [CanteenController],
})
export class CanteenModule {}
