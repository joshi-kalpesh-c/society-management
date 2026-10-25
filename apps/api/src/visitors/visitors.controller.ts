import { Controller, Get, NotImplementedException, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { SocietyMemberGuard } from "../auth/society-member.guard";
import { Roles, SocietyRoleGuard } from "../auth/roles.decorator";
import { SocietyRole } from "@society/contracts";

@Controller("societies/:societyId")
@UseGuards(AuthGuard, SocietyMemberGuard, SocietyRoleGuard)
export class VisitorsController {
  @Post("visitor-requests")
  @Roles(SocietyRole.Security)
  create() {
    throw new NotImplementedException(
      "Phase 5 — snapshot timeout/fallback settings at creation",
    );
  }

  @Get("visitor-requests")
  list() {
    throw new NotImplementedException("Phase 5 — role-scoped log/inbox");
  }

  @Post("visitor-requests/:id/approve")
  @Roles(SocietyRole.Resident)
  approve(@Param("id") id: string) {
    void id;
    throw new NotImplementedException("Phase 5 — atomic if pending");
  }

  @Post("visitor-requests/:id/reject")
  @Roles(SocietyRole.Resident)
  reject(@Param("id") id: string) {
    void id;
    throw new NotImplementedException("Phase 5 — atomic if pending");
  }

  @Post("visitor-requests/:id/security-approve")
  @Roles(SocietyRole.Security)
  securityApprove(@Param("id") id: string) {
    void id;
    throw new NotImplementedException(
      "Phase 5 — server timeout check, fallback enabled, mandatory reason",
    );
  }

  @Post("visitor-requests/:id/check-in")
  @Roles(SocietyRole.Security)
  checkIn(@Param("id") id: string) {
    void id;
    throw new NotImplementedException("Phase 5 — requires valid approval");
  }

  @Post("visitor-requests/:id/check-out")
  @Roles(SocietyRole.Security)
  checkOut(@Param("id") id: string) {
    void id;
    throw new NotImplementedException("Phase 5 — requires checked-in state");
  }
}
