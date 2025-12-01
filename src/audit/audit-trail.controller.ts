import { Controller, Get, Post, Body } from "@nestjs/common";
import { AuditTrailService } from "./audit-trail.service";
import { CreateAuditDto } from "./dto/create-audit.dto";

@Controller("audit-trail")
export class AuditTrailController {
  constructor(private readonly auditService: AuditTrailService) {}

  @Post()
  create(@Body() dto: CreateAuditDto) {
    return this.auditService.create(dto);
  }

  @Get()
  findAll() {
    return this.auditService.findAll();
  }
}
