import { unstable_noStore as noStore } from "next/cache";
import type { Game, User } from "@prisma/client/index";
import { demoAccounts, type SessionUser } from "@/lib/auth";
import { clubSummary, monthlyEvents, players, scoreTimeline } from "@/lib/data";
import { enrichPlayers, sortByGrowth } from "@/lib/scoring";
import { isDatabaseConfigured, prisma } from "@/lib/prisma";
import type {
  ClubSummary,
  EventSummary,
  MemberAdminSummary,
  PlayerSummary,
  ScoreRecord,
  UserProfileSummary
} from "@/lib/types";

type UserWithGames = User & {
  games: Game[];
};

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function stdDeviation(values: number[]) {
  if (values.length <= 1) {
    return 0;
  }

  const mean = average(values);
  const variance = average(values.map((value) => (value - mean) ** 2));

  return Math.sqrt(variance);
}

function percentage(part: number, whole: number) {
  if (whole === 0) {
    return 0;
  }

  return Math.round((part / whole) * 100);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
}

function toScoreRecord(game: Game, owner?: { id: string; name: string }): ScoreRecord {
  return {
    id: game.id,
    date: formatDate(game.playedAt),
    center: game.centerName,
    score: game.totalScore,
    strikes: game.strikeCount,
    spares: game.spareCount,
    opens: game.openCount,
    isDetailed: game.isDetailed,
    laneNumber: game.laneNumber,
    note: game.note,
    ownerUserId: owner?.id ?? game.userId,
    ownerName: owner?.name
  };
}

function chooseBadge(recentAverage: number, averageImprovement: number, spareImprovement: number) {
  if (recentAverage >= 200) {
    return "200 club";
  }

  if (averageImprovement >= 15) {
    return "Top grower candidate";
  }

  if (spareImprovement >= 10) {
    return "Spare master";
  }

  if (recentAverage >= 170) {
    return "Lane leader";
  }

  return "Club grinder";
}

function buildPlayerSummary(user: { id: string; name: string; games: Game[] }): PlayerSummary {
  const games = [...user.games].sort((a, b) => b.playedAt.getTime() - a.playedAt.getTime());
  const recent = games.slice(0, 5);
  const previous = games.slice(5, 10);
  const recentFallback = recent.length > 0 ? recent : games;
  const previousFallback = previous.length > 0 ? previous : recentFallback;

  const recentScores = recentFallback.map((game) => game.totalScore);
  const previousScores = previousFallback.map((game) => game.totalScore);
  const recentAverage = Math.round(average(recentScores));
  const previousAverage = Math.round(average(previousScores));
  const averageImprovement = recentAverage - previousAverage;

  const recentStrikeRate = percentage(
    recentFallback.reduce((sum, game) => sum + game.strikeCount, 0),
    recentFallback.length * 10
  );
  const previousStrikeRate = percentage(
    previousFallback.reduce((sum, game) => sum + game.strikeCount, 0),
    previousFallback.length * 10
  );
  const recentSpareRate = percentage(
    recentFallback.reduce((sum, game) => sum + game.spareCount, 0),
    recentFallback.length * 10
  );
  const previousSpareRate = percentage(
    previousFallback.reduce((sum, game) => sum + game.spareCount, 0),
    previousFallback.length * 10
  );

  return enrichPlayers([
    {
      id: user.id,
      name: user.name,
      badge: chooseBadge(recentAverage, averageImprovement, recentSpareRate - previousSpareRate),
      recentAverage,
      previousAverage,
      averageImprovement,
      spareImprovement: recentSpareRate - previousSpareRate,
      strikeImprovement: recentStrikeRate - previousStrikeRate,
      consistencyImprovement: clamp(
        Math.round(stdDeviation(previousScores) - stdDeviation(recentScores)),
        0,
        10
      ),
      participationBonus: clamp(
        games.filter((game) => Date.now() - game.playedAt.getTime() <= 1000 * 60 * 60 * 24 * 30).length,
        0,
        5
      ),
      highScore: Math.max(...games.map((game) => game.totalScore), 0)
    }
  ])[0];
}

function buildProfile(session: SessionUser, summary: PlayerSummary, games: ScoreRecord[]): UserProfileSummary {
  const totalFrames = Math.max(games.length * 10, 1);
  const strikeTotal = games.reduce((sum, game) => sum + game.strikes, 0);
  const spareTotal = games.reduce((sum, game) => sum + game.spares, 0);
  const openTotal = games.reduce((sum, game) => sum + game.opens, 0);

  return {
    id: session.userId,
    name: session.name,
    email: session.email,
    role: session.role,
    badge: summary.badge,
    recentAverage: summary.recentAverage,
    previousAverage: summary.previousAverage,
    growthScore: summary.growthScore,
    bestScore: summary.highScore,
    totalGames: games.length,
    strikeRate: percentage(strikeTotal, totalFrames),
    spareRate: percentage(spareTotal, totalFrames),
    openRate: percentage(openTotal, totalFrames),
    recentGames: games.slice(0, 8)
  };
}

function mapDemoProfile(session: SessionUser): UserProfileSummary {
  const summary =
    players.find((player) =>
      session.role === "ADMIN" ? player.name === "Kim Dohyeon" : player.name === "Jung Haram"
    ) ?? players[0];

  return buildProfile(session, summary, scoreTimeline);
}

export async function getPlayerSummaries() {
  noStore();

  if (!isDatabaseConfigured) {
    return players;
  }

  const users = await prisma.user.findMany({
    where: {
      isActive: true
    },
    include: {
      games: {
        orderBy: {
          playedAt: "desc"
        }
      }
    }
  });

  const withGames = users.filter((user) => user.games.length > 0);

  if (withGames.length === 0) {
    return players;
  }

  return withGames.map(buildPlayerSummary);
}

export async function getClubSummaryData(playerSummaries?: PlayerSummary[]): Promise<ClubSummary> {
  noStore();

  const summaries = playerSummaries ?? (await getPlayerSummaries());

  if (!isDatabaseConfigured) {
    return clubSummary;
  }

  const recentGames = await prisma.game.count({
    where: {
      playedAt: {
        gte: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
      }
    }
  });

  return {
    weeklyGames: `${recentGames} games`,
    averageScore: `${Math.round(average(summaries.map((player) => player.recentAverage)))} avg`,
    improvedMembers: `${summaries.filter((player) => player.averageImprovement > 0).length} rising`,
    seasonLeader: sortByGrowth(summaries)[0]?.name ?? "No leader yet"
  };
}

export async function getEvents() {
  noStore();
  return monthlyEvents as EventSummary[];
}

export async function getRecentScoreRecords(session?: SessionUser | null) {
  noStore();

  if (!session || !isDatabaseConfigured || session.userId.startsWith("demo-")) {
    return scoreTimeline;
  }

  const games = await prisma.game.findMany({
    where: {
      userId: session.userId
    },
    orderBy: {
      playedAt: "desc"
    },
    take: 10
  });

  if (games.length === 0) {
    return scoreTimeline;
  }

  return games.map((game) => toScoreRecord(game));
}

export async function getRecentClubGames() {
  noStore();

  if (!isDatabaseConfigured) {
    return scoreTimeline;
  }

  const games = await prisma.game.findMany({
    orderBy: {
      playedAt: "desc"
    },
    take: 8
  });

  if (games.length === 0) {
    return scoreTimeline;
  }

  return games.map((game) => toScoreRecord(game));
}

export async function getAdminManageableGames(session?: SessionUser | null) {
  noStore();

  if (!session || session.role !== "ADMIN") {
    return [];
  }

  if (!isDatabaseConfigured) {
    return scoreTimeline.map((record, index) => ({
      ...record,
      ownerUserId: index < 3 ? "demo-admin" : "demo-member",
      ownerName: index < 3 ? "Rolling Stones Captain" : "Rolling Stones Member"
    }));
  }

  const games = await prisma.game.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      playedAt: "desc"
    },
    take: 30
  });

  return games.map((game) => toScoreRecord(game, game.user));
}

export async function getManageableMembers(session?: SessionUser | null): Promise<MemberAdminSummary[]> {
  noStore();

  if (!session || session.role !== "ADMIN") {
    return [];
  }

  if (!isDatabaseConfigured) {
    return demoAccounts.map((account, index) => {
      const records =
        account.role === "ADMIN" ? scoreTimeline.slice(0, 3) : scoreTimeline.slice(3);

      return {
        id: account.userId,
        name: account.name,
        email: account.email,
        role: account.role,
        isActive: true,
        totalGames: records.length,
        recentAverage: Math.round(average(records.map((record) => record.score))),
        createdAt: scoreTimeline[index]?.date ?? "2026-03-01",
        lastPlayedAt: records[0]?.date ?? null
      };
    });
  }

  const users = await prisma.user.findMany({
    include: {
      games: {
        orderBy: {
          playedAt: "desc"
        }
      }
    },
    orderBy: [
      {
        role: "asc"
      },
      {
        createdAt: "asc"
      }
    ]
  });

  return users.map((user) => {
    const scores = user.games.slice(0, 5).map((game) => game.totalScore);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      totalGames: user.games.length,
      recentAverage: scores.length > 0 ? Math.round(average(scores)) : 0,
      createdAt: formatDate(user.createdAt),
      lastPlayedAt: user.games[0] ? formatDate(user.games[0].playedAt) : null
    };
  });
}

export async function getCurrentUserProfile(session?: SessionUser | null) {
  noStore();

  if (!session) {
    return null;
  }

  if (
    !isDatabaseConfigured ||
    session.userId.startsWith("demo-") ||
    demoAccounts.some((account) => account.userId === session.userId)
  ) {
    return mapDemoProfile(session);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      games: {
        orderBy: {
          playedAt: "desc"
        }
      }
    }
  });

  if (!user) {
    return mapDemoProfile(session);
  }

  const summary = buildPlayerSummary(user as UserWithGames);
  const records = user.games.map((game) => toScoreRecord(game));

  return buildProfile(session, summary, records);
}
