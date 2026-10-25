import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";
import { SocietyRole } from "@society/contracts";
import { PrismaService } from "../prisma/prisma.service";
import type { RequestUser } from "./current-user.decorator";

export interface SocietyRequest extends Request {
  user: RequestUser;
  membership: { societyId: string; role: SocietyRole };
}

/**
 * Resolves :societyId route param to a server-side verified membership.
 * Never trusts a client-supplied role. Compose after AuthGuard.
 */
@Injectable()
export class SocietyMemberGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<SocietyRequest>();
    if (!req.user?.id) throw new UnauthorizedException();
    const societyId = req.params.societyId;
    if (!societyId) throw new ForbiddenException("Missing society context");

    const membership = await this.prisma.societyMembership.findFirst({
      where: { societyId, userId: req.user.id, status: "active" },
      select: { role: true },
    });
    if (!membership) throw new ForbiddenException("Not a member");
    req.membership = {
      societyId,
      role: membership.role as SocietyRole,
    };
    return true;
  }
}
