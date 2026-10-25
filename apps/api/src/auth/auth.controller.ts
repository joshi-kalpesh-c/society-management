import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { IsEmail, IsString, MinLength } from "class-validator";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";
import { CurrentUser, type RequestUser } from "./current-user.decorator";
import { PrismaService } from "../prisma/prisma.service";

class SignInDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(1)
  password!: string;
}

@Controller()
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post("auth/sign-in")
  signIn(@Body() dto: SignInDto) {
    return this.auth.signIn(dto.email, dto.password);
  }

  /** GET /api/v1/me — identity and permitted society memberships. */
  @Get("me")
  @UseGuards(AuthGuard)
  async me(@CurrentUser() user: RequestUser) {
    const memberships = await this.prisma.societyMembership.findMany({
      where: { userId: user.id, status: "active" },
      include: { society: { select: { id: true, name: true } } },
    });
    return {
      userId: user.id,
      memberships: memberships.map((m) => ({
        societyId: m.society.id,
        societyName: m.society.name,
        role: m.role,
      })),
    };
  }
}
