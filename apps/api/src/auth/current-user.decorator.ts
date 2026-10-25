import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { Request } from "express";

export interface RequestUser {
  id: string;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestUser => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return (req as Request & { user: RequestUser }).user;
  },
);
