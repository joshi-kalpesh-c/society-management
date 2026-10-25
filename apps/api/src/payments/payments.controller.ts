import { Controller, Get, NotImplementedException, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { SocietyMemberGuard } from "../auth/society-member.guard";
import { Roles, SocietyRoleGuard } from "../auth/roles.decorator";
import { SocietyRole } from "@society/contracts";

@Controller("societies/:societyId")
@UseGuards(AuthGuard, SocietyMemberGuard, SocietyRoleGuard)
export class PaymentsController {
  @Get("payment-destination")
  destination() {
    throw new NotImplementedException("Phase 3");
  }

  @Post("payment-claims")
  submitClaim() {
    throw new NotImplementedException("Phase 3");
  }

  @Get("payment-claims")
  listClaims() {
    throw new NotImplementedException("Phase 3 — admin queue or own flat");
  }

  @Post("payment-claims/:id/verify")
  @Roles(SocietyRole.Admin)
  verify(@Param("id") id: string) {
    void id;
    throw new NotImplementedException(
      "Phase 3 — atomic settlement + outbox, bank-checked",
    );
  }

  @Post("payment-claims/:id/reject")
  @Roles(SocietyRole.Admin)
  reject(@Param("id") id: string) {
    void id;
    throw new NotImplementedException("Phase 3");
  }

  @Get("receipts/:id/download")
  receipt(@Param("id") id: string) {
    void id;
    throw new NotImplementedException("Phase 3 — short-lived private URL");
  }
}
