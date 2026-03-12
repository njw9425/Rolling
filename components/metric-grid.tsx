import { Activity, ChartColumnIncreasing, Flame, Trophy } from "lucide-react";
import type { ClubSummary } from "@/lib/types";

const items = [
  { key: "weeklyGames", label: "주간 경기 수", icon: Activity, color: "text-mint" },
  { key: "averageScore", label: "동아리 평균", icon: ChartColumnIncreasing, color: "text-gold" },
  { key: "improvedMembers", label: "성장 중인 인원", icon: Flame, color: "text-coral" },
  { key: "seasonLeader", label: "시즌 1위", icon: Trophy, color: "text-sky-300" }
] as const;

export function MetricGrid({ summary }: { summary: ClubSummary }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        const value = summary[item.key];
        return (
          <article key={item.key} className="metric-card">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">{item.label}</p>
                <p className="mt-3 font-display text-3xl font-bold text-white">{value}</p>
              </div>
              <div className={`rounded-2xl bg-white/10 p-3 ${item.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
