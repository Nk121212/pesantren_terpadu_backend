import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { MenuService } from "../menu/menu.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  private blacklistedTokens = new Set<string>();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private menuService: MenuService
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.password);
    if (match) return user;
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    const userMenu = await this.menuService.getMenuTreeByRole(user.role);

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      menu: userMenu,
    };
  }

  async getProfile(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException("User not found");

    const userMenu = await this.menuService.getMenuTreeByRole(user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      menu: userMenu,
    };
  }

  async logout(token: string) {
    this.blacklistedTokens.add(token);
  }

  isTokenBlacklisted(token: string) {
    return this.blacklistedTokens.has(token);
  }
}
