import type { PlayerSummary } from "@/lib/types";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function calculateGrowthScore(player: Omit<PlayerSummary, "growthScore">) {
  const averageComponent = clamp(player.averageImprovement * 2.5, 0, 50);
  const spareComponent = clamp(player.spareImprovement * 1.4, 0, 20);
  const strikeComponent = clamp(player.strikeImprovement * 1.6, 0, 15);
  const consistencyComponent = clamp(player.consistencyImprovement * 2, 0, 10);
  const participationComponent = clamp(player.participationBonus, 0, 5);

  return Math.round(
    averageComponent +
      spareComponent +
      strikeComponent +
      consistencyComponent +
      participationComponent
  );
}

export function enrichPlayers(players: Omit<PlayerSummary, "growthScore">[]): PlayerSummary[] {
  return players.map((player) => ({
    ...player,
    growthScore: calculateGrowthScore(player)
  }));
}

export function sortByGrowth(players: PlayerSummary[]) {
  return [...players].sort((a, b) => b.growthScore - a.growthScore);
}

export function sortByAverage(players: PlayerSummary[]) {
  return [...players].sort((a, b) => b.recentAverage - a.recentAverage);
}

export function sortByHighScore(players: PlayerSummary[]) {
  return [...players].sort((a, b) => b.highScore - a.highScore);
}
