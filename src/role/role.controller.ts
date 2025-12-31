import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from "@nestjs/common";
import { RoleService } from "./role.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { UpdateRoleDto } from "./dto/create-role.dto";
import { AssignPermissionsDto } from "./dto/assign-permissions.dto";
import { Role as PrismaRole } from "@prisma/client";

@Controller("roles")
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  @Roles("SUPERADMIN", "ADMIN")
  getAllRoles() {
    return this.roleService.getAllRoles();
  }

  @Get(":name")
  @Roles("SUPERADMIN", "ADMIN")
  getRoleByName(@Param("name") name: PrismaRole) {
    return this.roleService.getRoleByName(name);
  }

  @Put(":name")
  @Roles("SUPERADMIN")
  updateRole(
    @Param("name") name: PrismaRole,
    @Body() updateRoleDto: UpdateRoleDto
  ) {
    return this.roleService.updateRole(name, updateRoleDto);
  }

  @Post("assign-permissions")
  @Roles("SUPERADMIN")
  assignPermissions(@Body() assignPermissionsDto: AssignPermissionsDto) {
    return this.roleService.assignPermissions(assignPermissionsDto);
  }

  @Delete(":role/permissions/:menuId")
  @Roles("SUPERADMIN")
  removePermissions(
    @Param("role") role: PrismaRole,
    @Param("menuId") menuId: string
  ) {
    return this.roleService.removePermissions(role, menuId);
  }

  @Get(":name/permissions")
  @Roles("SUPERADMIN", "ADMIN")
  getRolePermissions(@Param("name") name: PrismaRole) {
    return this.roleService.getRolePermissions(name);
  }

  @Get(":name/users")
  @Roles("SUPERADMIN", "ADMIN")
  getUsersByRole(@Param("name") name: PrismaRole) {
    return this.roleService.getUsersByRole(name);
  }

  @Get(":name/menus")
  @Roles("SUPERADMIN", "ADMIN")
  async getMenusByRole(@Param("name") name: PrismaRole) {
    const permissions = await this.roleService.getRolePermissions(name);

    // Format menus with permissions
    const menus = permissions.map((perm) => ({
      id: perm.menu.id,
      name: perm.menu.name,
      icon: perm.menu.icon,
      path: perm.menu.path,
      order: perm.menu.order,
      parentId: perm.menu.parentId,
      isActive: perm.menu.isActive,
      permissions: {
        canView: perm.canView,
        canCreate: perm.canCreate,
        canEdit: perm.canEdit,
        canDelete: perm.canDelete,
        canExport: perm.canExport,
      },
      children: perm.menu.children.map((child) => ({
        id: child.id,
        name: child.name,
        icon: child.icon,
        path: child.path,
        order: child.order,
        isActive: child.isActive,
      })),
    }));

    return {
      role: name,
      totalMenus: menus.length,
      menus,
    };
  }
}
