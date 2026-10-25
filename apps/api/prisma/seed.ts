/**
 * Development seed — fictional users across two societies so tenant
 * isolation can be exercised even though production starts with one.
 * All passwords: "password123" (dev only).
 */
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const [sunrise, greenfield] = await Promise.all([
    prisma.society.upsert({
      where: { id: "00000000-0000-0000-0000-000000000001" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000001",
        name: "Sunrise Residency",
        settings: { create: {} },
      },
    }),
    prisma.society.upsert({
      where: { id: "00000000-0000-0000-0000-000000000002" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000002",
        name: "Greenfield Heights",
        settings: { create: {} },
      },
    }),
  ]);

  async function user(email: string, name: string) {
    return prisma.user.upsert({
      where: { email },
      update: {},
      create: { email, passwordHash, displayName: name },
    });
  }

  const admin = await user("admin@example.com", "Dev Admin");
  const resident = await user("resident@example.com", "Dev Resident");
  const security = await user("security@example.com", "Dev Security");
  const otherSocietyUser = await user(
    "outsider@example.com",
    "Other Society Member",
  );

  async function member(
    societyId: string,
    userId: string,
    role: string,
  ) {
    return prisma.societyMembership.upsert({
      where: { societyId_userId_role: { societyId, userId, role } },
      update: {},
      create: { societyId, userId, role },
    });
  }

  await member(sunrise.id, admin.id, "admin");
  await member(sunrise.id, resident.id, "resident");
  await member(sunrise.id, security.id, "security");
  await member(greenfield.id, otherSocietyUser.id, "resident");

  const wing = await prisma.building.upsert({
    where: { id: "00000000-0000-0000-0000-000000000010" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000010",
      societyId: sunrise.id,
      name: "A Wing",
    },
  });

  const flat = await prisma.flat.upsert({
    where: { id: "00000000-0000-0000-0000-000000000020" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000020",
      societyId: sunrise.id,
      buildingId: wing.id,
      flatNumber: "A-101",
    },
  });

  await prisma.flatMembership.upsert({
    where: { flatId_userId: { flatId: flat.id, userId: resident.id } },
    update: {},
    create: {
      societyId: sunrise.id,
      flatId: flat.id,
      userId: resident.id,
      canApproveVisitors: true,
    },
  });

  console.log("Seed complete:", {
    societies: [sunrise.name, greenfield.name],
    users: ["admin@example.com", "resident@example.com", "security@example.com", "outsider@example.com"],
    password: "password123",
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
