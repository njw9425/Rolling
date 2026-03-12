const { PrismaClient } = require("@prisma/client/index");
const { randomBytes, scryptSync } = require("crypto");

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function ensureGame(data) {
  const existing = await prisma.game.findFirst({
    where: {
      userId: data.userId,
      playedAt: new Date(data.playedAt),
      totalScore: data.totalScore
    }
  });

  if (!existing) {
    await prisma.game.create({
      data: {
        ...data,
        playedAt: new Date(data.playedAt)
      }
    });
  }
}

async function main() {
  const captain = await prisma.user.upsert({
    where: { email: "captain@rollingstones.club" },
    update: {},
    create: {
      name: "Rolling Stones Captain",
      email: "captain@rollingstones.club",
      passwordHash: hashPassword("bowling123!"),
      role: "ADMIN",
      isActive: true
    }
  });

  const member = await prisma.user.upsert({
    where: { email: "member@rollingstones.club" },
    update: {},
    create: {
      name: "Rolling Stones Member",
      email: "member@rollingstones.club",
      passwordHash: hashPassword("bowling123!"),
      role: "MEMBER",
      isActive: true
    }
  });

  await prisma.season.upsert({
    where: { id: "rolling-stones-spring-2026" },
    update: { isActive: true },
    create: {
      id: "rolling-stones-spring-2026",
      name: "Rolling Stones Spring 2026",
      startDate: new Date("2026-03-01T00:00:00.000Z"),
      endDate: new Date("2026-06-30T23:59:59.999Z"),
      isActive: true
    }
  });

  const badge = await prisma.badge.upsert({
    where: { name: "Top grower candidate" },
    update: {},
    create: {
      name: "Top grower candidate",
      description: "Awarded to members with strong recent improvement.",
      icon: "spark"
    }
  });

  await prisma.userBadge.upsert({
    where: { id: "captain-grower-badge" },
    update: {},
    create: {
      id: "captain-grower-badge",
      userId: captain.id,
      badgeId: badge.id
    }
  });

  await ensureGame({
    userId: captain.id,
    playedAt: "2026-03-10",
    centerName: "Red Pin",
    laneNumber: 7,
    totalScore: 168,
    strikeCount: 4,
    spareCount: 5,
    openCount: 1,
    note: "Demo seeded captain game"
  });

  await ensureGame({
    userId: captain.id,
    playedAt: "2026-03-08",
    centerName: "City Bowl",
    laneNumber: 5,
    totalScore: 159,
    strikeCount: 3,
    spareCount: 6,
    openCount: 1,
    note: "Demo seeded captain game"
  });

  await ensureGame({
    userId: captain.id,
    playedAt: "2026-03-05",
    centerName: "Strike Zone",
    laneNumber: 8,
    totalScore: 172,
    strikeCount: 5,
    spareCount: 4,
    openCount: 1,
    note: "Demo seeded captain game"
  });

  await ensureGame({
    userId: member.id,
    playedAt: "2026-03-09",
    centerName: "Red Pin",
    laneNumber: 6,
    totalScore: 146,
    strikeCount: 3,
    spareCount: 4,
    openCount: 3,
    note: "Demo seeded member game"
  });

  await ensureGame({
    userId: member.id,
    playedAt: "2026-03-04",
    centerName: "City Bowl",
    laneNumber: 3,
    totalScore: 154,
    strikeCount: 3,
    spareCount: 5,
    openCount: 2,
    note: "Demo seeded member game"
  });

  console.log("Seed complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
