import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthController } from "./health.controller";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { SocietiesModule } from "./societies/societies.module";
import { FlatsModule } from "./flats/flats.module";
import { MaintenanceModule } from "./maintenance/maintenance.module";
import { PaymentsModule } from "./payments/payments.module";
import { CampaignsModule } from "./campaigns/campaigns.module";
import { NoticesModule } from "./notices/notices.module";
import { VisitorsModule } from "./visitors/visitors.module";
import { AssetsModule } from "./assets/assets.module";
import { AuditModule } from "./audit/audit.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    SocietiesModule,
    FlatsModule,
    MaintenanceModule,
    PaymentsModule,
    CampaignsModule,
    NoticesModule,
    VisitorsModule,
    AssetsModule,
    AuditModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
