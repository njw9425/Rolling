import { Crown, TrendingUp } from "lucide-react";
import { sortByGrowth } from "@/lib/scoring";
import type { PlayerSummary } from "@/lib/types";

export function LeaderboardPreview({ players }: { players: PlayerSummary[] }) {
  const growthLeaders = sortByGrowth(players).slice(0, 5);

  return (
    <section className="panel-light p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="section-title">이번 달 성장 TOP 5</h2>
          <p className="mt-2 text-sm text-slate-600">초보도 올라올 수 있는 성장 중심 경쟁 구조입니다.</p>
        </div>
        <div className="rounded-full bg-amber-100 p-3 text-amber-600">
          <Crown className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-6 grid gap-3">
        {growthLeaders.map((player, index) => (
          <div key={player.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 font-semibold text-white">
                {index + 1}
              </div>
              <div>
                <p className="font-semibold text-slate-950">{player.name}</p>
                <p className="text-sm text-slate-500">{player.badge}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-slate-950">{player.growthScore}점</p>
              <p className="inline-flex items-center gap-1 text-sm text-emerald-600">
                <TrendingUp className="h-4 w-4" />+{player.averageImprovement}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
