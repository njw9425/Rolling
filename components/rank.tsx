import { Medal, TrendingUp } from "lucide-react";
import type { PlayerSummary } from "@/lib/types";

export function Rank({ player, rank }: { player: PlayerSummary; rank: number }) {
  return (
    <article className="flex flex-col gap-4 rounded-[24px] border border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 font-bold text-white">{rank}</div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-semibold text-slate-950">{player.name}</p>
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700">{player.badge}</span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            최근 평균 {player.recentAverage} / 이전 평균 {player.previousAverage}
          </p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-4">
        <Stat label="성장 점수" value={`${player.growthScore}점`} accent="text-gold" />
        <Stat label="평균 상승" value={`+${player.averageImprovement}`} accent="text-emerald-600" />
        <Stat label="스페어 개선" value={`+${player.spareImprovement}%`} accent="text-sky-600" />
        <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
            <Medal className="h-4 w-4" />
            최고점
          </div>
          <p className="mt-2 text-lg font-semibold">{player.highScore}</p>
        </div>
      </div>
    </article>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
        <TrendingUp className="h-4 w-4" />
        {label}
      </div>
      <p className={`mt-2 text-lg font-semibold ${accent}`}>{value}</p>
    </div>
  );
}
