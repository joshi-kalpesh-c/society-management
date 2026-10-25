import { Module } from "@nestjs/common";
import { VisitorsController } from "./visitors.controller";

@Module({ controllers: [VisitorsController] })
export class VisitorsModule {}
