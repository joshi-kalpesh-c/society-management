import { Controller, Get, NotImplementedException, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { SocietyMemberGuard } from "../auth/society-member.guard";
import { Roles, SocietyRoleGuard } from "../auth/roles.decorator";
import { SocietyRole } from "@society/contracts";

@Controller("societies/:societyId/notices")
@UseGuards(AuthGuard, SocietyMemberGuard, SocietyRoleGuard)
export class NoticesController {
  @Get()
  list() {
    throw new NotImplementedException("Phase 4 — authorized published notices");
  }

  @Post()
  @Roles(SocietyRole.Admin)
  createDraft() {
    throw new NotImplementedException("Phase 4");
  }

  @Post(":id/publish")
  @Roles(SocietyRole.Admin)
  publish() {
    throw new NotImplementedException("Phase 4 — durable + queued deliveries");
  }
}
