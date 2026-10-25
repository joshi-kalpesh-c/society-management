import { Module } from "@nestjs/common";
import { FlatsController } from "./flats.controller";

@Module({ controllers: [FlatsController] })
export class FlatsModule {}
