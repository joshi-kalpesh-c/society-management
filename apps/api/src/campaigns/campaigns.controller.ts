import { Controller, Get, NotImplementedException, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { SocietyMemberGuard } from "../auth/society-member.guard";
import { Roles, SocietyRoleGuard } from "../auth/roles.decorator";
import { SocietyRole } from "@society/contracts";

@Controller("societies/:societyId/campaigns")
@UseGuards(AuthGuard, SocietyMemberGuard, SocietyRoleGuard)
export class CampaignsController {
  @Get()
  list() {
    throw new NotImplementedException("Phase 4");
  }

  @Post()
  @Roles(SocietyRole.Admin)
  create() {
    throw new NotImplementedException("Phase 4");
  }

  @Post(":id/reminders/preview")
  @Roles(SocietyRole.Admin)
  reminderPreview() {
    throw new NotImplementedException("Phase 4 — eligible counts, no send");
  }
}
