// src/audit/audit.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { AuditTrailService } from "./audit-trail.service";

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditTrailService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request & { user?: any }>();
    const method = req.method;
    const path = (req as any).route
      ? (req as any).route.path
      : (req as any).url;
    const user = req.user;
    const userId = user ? user.userId ?? user.id ?? null : null;

    const before = Date.now();

    return next.handle().pipe(
      tap(async (res) => {
        const action = `${method} ${path}`;
        let recordId: number | null = null;
        if (res && typeof res === "object") {
          if ("id" in res && typeof res.id === "number") recordId = res.id;
          if (
            !recordId &&
            res.data &&
            typeof res.data === "object" &&
            "id" in res.data
          ) {
            recordId = res.data.id;
          }
        }

        const noteParts = [];
        try {
          const body = (req as any).body;
          if (body && Object.keys(body).length > 0) {
            const json = JSON.stringify(body);
            noteParts.push(
              json.length > 400 ? json.slice(0, 400) + "..." : json
            );
          }
        } catch (e) {
          // ignore
        }

        const note = noteParts.length ? noteParts.join(" | ") : null;

        await this.auditService.log({
          module: path || (req as any).url,
          action,
          recordId,
          userId,
          note,
        });
      })
    );
  }
}
