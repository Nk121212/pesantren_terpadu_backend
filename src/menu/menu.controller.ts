import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from "@nestjs/common";
import { MenuService } from "./menu.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { AssignMenuRoleDto } from "./dto/assign-menu-role.dto";
import { Role } from "@prisma/client";

@Controller("menu")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Post()
  @Roles("SUPERADMIN", "ADMIN")
  createMenu(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }

  @Get()
  @Roles("SUPERADMIN", "ADMIN")
  getAllMenus() {
    return this.menuService.getAllMenus();
  }

  @Post("assign")
  @Roles("SUPERADMIN")
  assignMenuToRole(@Body() assignMenuRoleDto: AssignMenuRoleDto) {
    return this.menuService.assignMenuToRole(assignMenuRoleDto);
  }

  @Get("my-menu")
  async getMyMenu(@Request() req) {
    const userRole = req.user.role;
    return this.menuService.getMenuTreeByRole(userRole);
  }

  @Get("role/:role")
  @Roles("SUPERADMIN", "ADMIN")
  getMenuByRole(@Param("role") role: Role) {
    return this.menuService.getMenuTreeByRole(role);
  }
}
