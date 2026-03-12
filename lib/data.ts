import { enrichPlayers } from "@/lib/scoring";
import type { ClubSummary, EventSummary, ScoreRecord } from "@/lib/types";

export const players = enrichPlayers([
  {
    id: "p1",
    name: "Kim Dohyeon",
    badge: "Top grower candidate",
    recentAverage: 164,
    previousAverage: 146,
    averageImprovement: 18,
    spareImprovement: 11,
    strikeImprovement: 7,
    consistencyImprovement: 4,
    participationBonus: 5,
    highScore: 212
  },
  {
    id: "p2",
    name: "Park Seoyoon",
    badge: "Spare master",
    recentAverage: 171,
    previousAverage: 160,
    averageImprovement: 11,
    spareImprovement: 13,
    strikeImprovement: 4,
    consistencyImprovement: 3,
    participationBonus: 4,
    highScore: 223
  },
  {
    id: "p3",
    name: "Lee Junho",
    badge: "Most consistent",
    recentAverage: 157,
    previousAverage: 149,
    averageImprovement: 8,
    spareImprovement: 9,
    strikeImprovement: 5,
    consistencyImprovement: 4,
    participationBonus: 5,
    highScore: 205
  },
  {
    id: "p4",
    name: "Choi Minji",
    badge: "First 200 game",
    recentAverage: 149,
    previousAverage: 134,
    averageImprovement: 15,
    spareImprovement: 7,
    strikeImprovement: 6,
    consistencyImprovement: 2,
    participationBonus: 5,
    highScore: 201
  },
  {
    id: "p5",
    name: "Jung Haram",
    badge: "Late-game focus up",
    recentAverage: 153,
    previousAverage: 144,
    averageImprovement: 9,
    spareImprovement: 8,
    strikeImprovement: 5,
    consistencyImprovement: 3,
    participationBonus: 3,
    highScore: 198
  }
]);

export const clubSummary: ClubSummary = {
  weeklyGames: "48 games",
  averageScore: "154 avg",
  improvedMembers: "17 rising",
  seasonLeader: "Park Seoyoon"
};

export const monthlyEvents: EventSummary[] = [
  {
    id: "e1",
    date: "03.15 SAT 15:00",
    title: "March league day",
    description: "Season standings match. Handicap and growth score are both included.",
    type: "League",
    location: "Red Pin Bowling Center",
    attendees: 18
  },
  {
    id: "e2",
    date: "03.19 WED 19:30",
    title: "Midweek casual night",
    description: "Beginner-friendly meetup with spare practice and two casual games.",
    type: "Event",
    location: "City Bowl",
    attendees: 11
  },
  {
    id: "e3",
    date: "03.23 SUN 14:00",
    title: "Monthly growth challenge",
    description: "MVP badge awarded from the recent five-game average increase.",
    type: "Challenge",
    location: "Strike Zone",
    attendees: 16
  }
];

export const scoreTimeline: ScoreRecord[] = [
  { id: "g1", date: "2026-03-10", center: "Red Pin", score: 168, strikes: 4, spares: 5, opens: 1 },
  { id: "g2", date: "2026-03-08", center: "City Bowl", score: 159, strikes: 3, spares: 6, opens: 1 },
  { id: "g3", date: "2026-03-05", center: "Strike Zone", score: 172, strikes: 5, spares: 4, opens: 1 },
  { id: "g4", date: "2026-03-02", center: "Red Pin", score: 149, strikes: 3, spares: 4, opens: 3 },
  { id: "g5", date: "2026-02-27", center: "City Bowl", score: 163, strikes: 4, spares: 5, opens: 1 }
];
