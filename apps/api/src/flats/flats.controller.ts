import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import {
  SocietyMemberGuard,
  type SocietyRequest,
} from "../auth/society-member.guard";
import { SocietyRoleGuard } from "../auth/roles.decorator";
import { PrismaService } from "../prisma/prisma.service";

/**
 * Routes live under /api/v1/societies/:societyId.
 * Guards: authenticated -> society membership resolved -> role checked.
 */
@Controller("societies/:societyId/flats")
@UseGuards(AuthGuard, SocietyMemberGuard, SocietyRoleGuard)
export class FlatsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async list(@Req() req: SocietyRequest) {
    // TODO: role-appropriate field selection (admin sees all; resident/security scoped)
    return this.prisma.flat.findMany({
      where: { societyId: req.membership.societyId },
      select: {
        id: true,
        flatNumber: true,
        status: true,
        building: { select: { id: true, name: true } },
      },
      orderBy: { flatNumber: "asc" },
    });
  }
}
