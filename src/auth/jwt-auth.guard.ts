import {
  Injectable,
  UnauthorizedException,
  Inject,
  forwardRef,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { ExecutionContext } from "@nestjs/common";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  // Gunakan Inject + forwardRef untuk menghindari circular dependency
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) {
    super();
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];

    // Log debug (bisa dihapus nanti)
    // console.log("JwtAuthGuard handleRequest", { err, user, info, token });

    // cek error passport
    if (err || !user) {
      throw err || new UnauthorizedException("Unauthorized");
    }

    // cek blacklist jika authService sudah inject dengan benar
    if (token && this.authService?.isTokenBlacklisted?.(token)) {
      throw new UnauthorizedException("Token has been logged out");
    }

    return user;
  }
}
