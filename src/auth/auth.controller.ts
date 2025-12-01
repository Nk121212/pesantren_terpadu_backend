import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    if (!user) throw new UnauthorizedException("Invalid credentials");
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  async logout(@Request() req) {
    const token = req.headers.authorization.split(" ")[1];
    await this.authService.logout(token);
    return { success: true, message: "Logged out successfully" };
  }
}
