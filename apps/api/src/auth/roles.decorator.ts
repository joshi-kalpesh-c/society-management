import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { SocietyRole } from "@society/contracts";
import type { SocietyRequest } from "./society-member.guard";

export const ROLES_KEY = "society_roles";
export const Roles = (...roles: SocietyRole[]) =>
  SetMetadata(ROLES_KEY, roles);

/** Enforces role after SocietyMemberGuard has populated req.membership. */
@Injectable()
export class SocietyRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<SocietyRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!required?.length) return true;
    const req = context.switchToHttp().getRequest<SocietyRequest>();
    if (!req.membership) throw new UnauthorizedException();
    if (!required.includes(req.membership.role)) {
      throw new ForbiddenException("Insufficient role");
    }
    return true;
  }
}
