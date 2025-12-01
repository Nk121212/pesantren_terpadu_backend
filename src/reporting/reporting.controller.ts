import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ReportingService } from "./reporting.service";
import { GetReportDto } from "./dto/get-report.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { Role } from "@prisma/client";

@Controller("reporting")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportingController {
  constructor(private readonly reportingService: ReportingService) {}

  @Get("finance")
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  getFinance(@Query() dto: GetReportDto) {
    return this.reportingService.getFinanceReport(dto);
  }

  @Get("savings")
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  getSavings(@Query() dto: GetReportDto) {
    return this.reportingService.getSavingsReport(dto);
  }

  @Get("payroll")
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  getPayroll(@Query() dto: GetReportDto) {
    return this.reportingService.getPayrollReport(dto);
  }

  @Get("invoice")
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  getInvoice(@Query() dto: GetReportDto) {
    return this.reportingService.getInvoiceReport(dto);
  }

  @Get("ppdb")
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  getPpdb(@Query() dto: GetReportDto) {
    return this.reportingService.getPpdbReport(dto);
  }

  @Get("dashboard-summary")
  @Roles(Role.ADMIN, Role.SUPERADMIN)
  getDashboardSummary(@Query() dto: GetReportDto) {
    return this.reportingService.getDashboardSummary(dto);
  }
}
