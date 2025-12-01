import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";

import { PrismaModule } from "./prisma/prisma.module";
import { PrismaService } from "./prisma/prisma.service";
import { FcmService } from "./common/services/fcm.service";

// --- Core Modules ---
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { InvoiceModule } from "./invoice/invoice.module";
import { PaymentsModule } from "./payments/payments.module";
import { SantriModule } from "./santri/santri.module";
import { SavingsModule } from "./savings/savings.module";
import { PpdbModule } from "./ppdb/ppdb.module";
import { ReportingModule } from "./reporting/reporting.module";

// --- New / Extended Modules ---
import { CanteenModule } from "./canteen/canteen.module";
import { CounselingModule } from "./counseling/counseling.module";
import { PermissionModule } from "./permission/permission.module";
import { TahfidzModule } from "./tahfidz/tahfidz.module";
import { PembinaanModule } from "./pembinaan/pembinaan.module";
import { AuditTrailModule } from "./audit/audit-trail.module";
import { FinanceModule } from "./finance/finance.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ScheduleModule.forRoot(),

    // --- Core System ---
    UsersModule,
    AuthModule,
    InvoiceModule,
    PaymentsModule,
    SantriModule,
    SavingsModule,
    PpdbModule,
    ReportingModule,

    // --- Additional / Integrated Modules ---
    CanteenModule,
    CounselingModule,
    PermissionModule,
    TahfidzModule,
    PembinaanModule,
    AuditTrailModule,
    FinanceModule,
  ],
  providers: [PrismaService, FcmService],
})
export class AppModule {}
