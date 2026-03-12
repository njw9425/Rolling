export type PlayerSummary = {
  id: string;
  name: string;
  badge: string;
  recentAverage: number;
  previousAverage: number;
  averageImprovement: number;
  spareImprovement: number;
  strikeImprovement: number;
  consistencyImprovement: number;
  participationBonus: number;
  growthScore: number;
  highScore: number;
};

export type ClubSummary = {
  weeklyGames: string;
  averageScore: string;
  improvedMembers: string;
  seasonLeader: string;
};

export type EventSummary = {
  id: string;
  date: string;
  title: string;
  description: string;
  type: string;
  location: string;
  attendees: number;
};

export type ScoreRecord = {
  id: string;
  date: string;
  center: string;
  score: number;
  strikes: number;
  spares: number;
  opens: number;
  isDetailed?: boolean;
  laneNumber?: number | null;
  note?: string | null;
  ownerUserId?: string;
  ownerName?: string;
};

export type UserProfileSummary = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  badge: string;
  recentAverage: number;
  previousAverage: number;
  growthScore: number;
  bestScore: number;
  totalGames: number;
  strikeRate: number;
  spareRate: number;
  openRate: number;
  recentGames: ScoreRecord[];
};

export type MemberAdminSummary = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
  isActive: boolean;
  totalGames: number;
  recentAverage: number;
  createdAt: string;
  lastPlayedAt?: string | null;
};
