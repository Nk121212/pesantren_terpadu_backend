import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./create-user.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { RolesGuard } from "../common/guards/roles.guard";
import { Role } from "@prisma/client";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  // Only SUPERADMIN and ADMIN can create users
  @Post()
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  // List all users (admin)
  @Get()
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  async list(@Query("skip") skip = "0", @Query("take") take = "20") {
    return this.usersService.list({
      skip: Number(skip),
      take: Number(take),
    });
  }

  // Get current user
  @Get("me")
  async me(@Request() req: any) {
    return this.usersService.findById(Number(req.user.userId));
  }

  // Get user by id (admin only)
  @Get(":id")
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  getOne(@Param("id") id: string) {
    return this.usersService.findById(Number(id));
  }

  // Update user (self or admin)
  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() body: any,
    @Request() req: any
  ) {
    const userId = Number(req.user.userId);
    const targetId = Number(id);

    if (
      req.user.role !== Role.SUPERADMIN &&
      req.user.role !== Role.ADMIN &&
      userId !== targetId
    ) {
      return { statusCode: 403, message: "Forbidden" };
    }

    return this.usersService.update(targetId, body);
  }

  // Delete user (admin)
  @Delete(":id")
  @Roles(Role.SUPERADMIN, Role.ADMIN)
  remove(@Param("id") id: string) {
    return this.usersService.remove(Number(id));
  }
}
