import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { AssignMenuRoleDto } from "./dto/assign-menu-role.dto";
import { Role } from "@prisma/client";

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async createMenu(createMenuDto: CreateMenuDto) {
    return this.prisma.menu.create({
      data: {
        parentId: createMenuDto.parentId,
        name: createMenuDto.name,
        icon: createMenuDto.icon,
        path: createMenuDto.path,
        order: createMenuDto.order || 0,
        isActive: createMenuDto.isActive !== false,
      },
    });
  }

  async getAllMenus() {
    return this.prisma.menu.findMany({
      where: { parentId: null },
      include: {
        children: {
          orderBy: { order: "asc" },
          include: {
            roleMenus: true,
          },
        },
        roleMenus: true,
      },
      orderBy: { order: "asc" },
    });
  }

  async assignMenuToRole(assignMenuRoleDto: AssignMenuRoleDto) {
    const menu = await this.prisma.menu.findUnique({
      where: { id: assignMenuRoleDto.menuId },
    });

    if (!menu) {
      throw new NotFoundException("Menu not found");
    }

    return this.prisma.roleMenu.upsert({
      where: {
        role_menuId: {
          role: assignMenuRoleDto.role,
          menuId: assignMenuRoleDto.menuId,
        },
      },
      update: {
        canView: assignMenuRoleDto.canView !== false,
        canCreate: assignMenuRoleDto.canCreate || false,
        canEdit: assignMenuRoleDto.canEdit || false,
        canDelete: assignMenuRoleDto.canDelete || false,
        canExport: assignMenuRoleDto.canExport || false,
      },
      create: {
        role: assignMenuRoleDto.role,
        menuId: assignMenuRoleDto.menuId,
        canView: assignMenuRoleDto.canView !== false,
        canCreate: assignMenuRoleDto.canCreate || false,
        canEdit: assignMenuRoleDto.canEdit || false,
        canDelete: assignMenuRoleDto.canDelete || false,
        canExport: assignMenuRoleDto.canExport || false,
      },
    });
  }

  async getMenuByRole(role: Role) {
    // Jika role adalah SUPERADMIN, kembalikan semua menu aktif
    if (role === Role.SUPERADMIN) {
      return this.prisma.menu.findMany({
        where: {
          isActive: true,
        },
        include: {
          children: {
            where: {
              isActive: true,
            },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { order: "asc" },
      });
    }

    // Untuk role selain SUPERADMIN, gunakan filter berdasarkan roleMenus
    return this.prisma.menu.findMany({
      where: {
        isActive: true,
        roleMenus: {
          some: {
            role: role,
            canView: true,
          },
        },
      },
      include: {
        children: {
          where: {
            isActive: true,
            roleMenus: {
              some: {
                role: role,
                canView: true,
              },
            },
          },
          include: {
            roleMenus: {
              where: { role: role },
            },
          },
          orderBy: { order: "asc" },
        },
        roleMenus: {
          where: { role: role },
        },
      },
      orderBy: { order: "asc" },
    });
  }

  async getMenuTreeByRole(role: Role) {
    const menus = await this.getMenuByRole(role);

    // Format menjadi hierarki
    const menuTree = menus
      .filter((menu) => !menu.parentId) // Hanya parent menus
      .map((parentMenu) => {
        // Untuk SUPERADMIN, buat permissions dengan semua akses true
        let parentPermissions = null;
        if (role === Role.SUPERADMIN) {
          parentPermissions = {
            canView: true,
            canCreate: true,
            canEdit: true,
            canDelete: true,
            canExport: true,
          };
        } else {
          // Type assertion untuk menghindari error TypeScript
          const typedParentMenu = parentMenu as any;
          parentPermissions = typedParentMenu.roleMenus?.[0] || null;
        }

        // Map children dengan permissions yang sesuai
        const childrenWithPermissions = parentMenu.children.map((childMenu) => {
          let childPermissions = null;
          if (role === Role.SUPERADMIN) {
            childPermissions = {
              canView: true,
              canCreate: true,
              canEdit: true,
              canDelete: true,
              canExport: true,
            };
          } else {
            // Type assertion untuk menghindari error TypeScript
            const typedChildMenu = childMenu as any;
            childPermissions = typedChildMenu.roleMenus?.[0] || null;
          }

          return {
            ...childMenu,
            permissions: childPermissions,
          };
        });

        return {
          ...parentMenu,
          permissions: parentPermissions,
          children: childrenWithPermissions,
        };
      });

    return menuTree;
  }

  // Optional: Method untuk mendapatkan semua permissions SUPERADMIN
  async getSuperAdminMenuPermissions() {
    const allMenus = await this.prisma.menu.findMany({
      where: { isActive: true },
      include: {
        children: {
          where: { isActive: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    // Tambahkan default permissions untuk SUPERADMIN
    const superAdminMenus = allMenus.map((menu) => ({
      ...menu,
      permissions: {
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canExport: true,
      },
      children:
        menu.children?.map((child) => ({
          ...child,
          permissions: {
            canView: true,
            canCreate: true,
            canEdit: true,
            canDelete: true,
            canExport: true,
          },
        })) || [],
    }));

    return superAdminMenus.filter((menu) => !menu.parentId);
  }
}
