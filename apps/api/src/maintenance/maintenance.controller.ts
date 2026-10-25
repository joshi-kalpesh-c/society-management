import { Controller, Get, NotImplementedException, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { SocietyMemberGuard } from "../auth/society-member.guard";
import { Roles, SocietyRoleGuard } from "../auth/roles.decorator";
import { SocietyRole } from "@society/contracts";

@Controller("societies/:societyId")
@UseGuards(AuthGuard, SocietyMemberGuard, SocietyRoleGuard)
export class MaintenanceController {
  @Get("maintenance-policies")
  @Roles(SocietyRole.Admin)
  listPolicies() {
    throw new NotImplementedException("Phase 2");
  }

  @Post("maintenance-runs/preview")
  @Roles(SocietyRole.Admin)
  previewRun() {
    throw new NotImplementedException("Phase 2");
  }

  @Post("maintenance-runs")
  @Roles(SocietyRole.Admin)
  generateRun() {
    throw new NotImplementedException("Phase 2 — idempotent generation");
  }

  @Get("maintenance-bills")
  listBills() {
    throw new NotImplementedException("Phase 2");
  }

  @Get("maintenance-bills/:id/payable")
  payable(@Param("id") id: string) {
    void id;
    throw new NotImplementedException("Phase 2 — dated payable quote");
  }
}
