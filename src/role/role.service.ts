import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Role as PrismaRole } from "@prisma/client";
import { CreateRoleDto, UpdateRoleDto } from "./dto/create-role.dto";
import { AssignPermissionsDto } from "./dto/assign-permissions.dto";

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async getAllRoles() {
    // Get all roles from enum
    const roles = Object.values(PrismaRole);

    // Get additional info from database for each role
    const rolesWithInfo = await Promise.all(
      roles.map(async (role) => {
        const roleMenus = await this.prisma.roleMenu.findMany({
          where: { role },
          include: {
            menu: true,
          },
        });

        const usersWithRole = await this.prisma.user.count({
          where: { role },
        });

        return {
          name: role,
          description: this.getRoleDescription(role),
          totalMenus: roleMenus.length,
          totalUsers: usersWithRole,
          permissions: roleMenus,
        };
      })
    );

    return rolesWithInfo;
  }

  async getRoleByName(name: PrismaRole) {
    // Check if role exists in enum
    if (!Object.values(PrismaRole).includes(name)) {
      throw new NotFoundException(`Role ${name} not found`);
    }

    const roleMenus = await this.prisma.roleMenu.findMany({
      where: { role: name },
      include: {
        menu: {
          include: {
            children: true,
          },
        },
      },
      orderBy: {
        menu: {
          order: "asc",
        },
      },
    });

    const usersWithRole = await this.prisma.user.findMany({
      where: { role: name },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      name,
      description: this.getRoleDescription(name),
      totalMenus: roleMenus.length,
      totalUsers: usersWithRole.length,
      permissions: roleMenus.map((rm) => ({
        menu: rm.menu,
        canView: rm.canView,
        canCreate: rm.canCreate,
        canEdit: rm.canEdit,
        canDelete: rm.canDelete,
        canExport: rm.canExport,
      })),
      users: usersWithRole,
    };
  }

  async updateRole(name: PrismaRole, updateRoleDto: UpdateRoleDto) {
    // Note: Since role is an enum, we can't update the name
    // We can only update metadata or permissions
    return {
      message: `Role ${name} updated successfully`,
      description: updateRoleDto.description || this.getRoleDescription(name),
    };
  }

  async assignPermissions(assignPermissionsDto: AssignPermissionsDto) {
    const { role, menuId, ...permissions } = assignPermissionsDto;

    // Check if menu exists
    const menu = await this.prisma.menu.findUnique({
      where: { id: parseInt(menuId) },
    });

    if (!menu) {
      throw new NotFoundException("Menu not found");
    }

    // Check if role exists in enum
    if (!Object.values(PrismaRole).includes(role)) {
      throw new NotFoundException(`Role ${role} not found`);
    }

    // Upsert permissions
    return this.prisma.roleMenu.upsert({
      where: {
        role_menuId: {
          role,
          menuId: parseInt(menuId),
        },
      },
      update: {
        canView: permissions.canView !== undefined ? permissions.canView : true,
        canCreate: permissions.canCreate || false,
        canEdit: permissions.canEdit || false,
        canDelete: permissions.canDelete || false,
        canExport: permissions.canExport || false,
      },
      create: {
        role,
        menuId: parseInt(menuId),
        canView: permissions.canView !== undefined ? permissions.canView : true,
        canCreate: permissions.canCreate || false,
        canEdit: permissions.canEdit || false,
        canDelete: permissions.canDelete || false,
        canExport: permissions.canExport || false,
      },
      include: {
        menu: true,
      },
    });
  }

  async removePermissions(role: PrismaRole, menuId: string) {
    try {
      await this.prisma.roleMenu.delete({
        where: {
          role_menuId: {
            role,
            menuId: parseInt(menuId),
          },
        },
      });

      return {
        message: "Permissions removed successfully",
      };
    } catch (error) {
      throw new NotFoundException("Permission not found");
    }
  }

  async getRolePermissions(role: PrismaRole) {
    return this.prisma.roleMenu.findMany({
      where: { role },
      include: {
        menu: {
          include: {
            children: true,
          },
        },
      },
      orderBy: {
        menu: {
          order: "asc",
        },
      },
    });
  }

  async getUsersByRole(role: PrismaRole) {
    return this.prisma.user.findMany({
      where: { role },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
  }

  private getRoleDescription(role: PrismaRole): string {
    const descriptions = {
      SUPERADMIN: "Full system access with all privileges",
      ADMIN: "Administrative access to manage system settings",
      STAFF: "Staff member with limited administrative access",
      TEACHER: "Teaching staff with access to academic modules",
      STUDENT: "Student access to personal dashboard and features",
      GUARDIAN: "Parent/guardian access to monitor their children",
      MERCHANT: "Canteen merchant access for e-kantin system",
    };

    return descriptions[role] || "No description available";
  }
}
