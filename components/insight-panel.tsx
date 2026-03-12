import { Sparkles } from "lucide-react";
import type { PlayerSummary } from "@/lib/types";

export function InsightPanel({ players }: { players: PlayerSummary[] }) {
  const rising = [...players]
    .sort((a, b) => b.averageImprovement - a.averageImprovement)
    .slice(0, 3);

  return (
    <section className="panel-light p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">자동 피드백</h2>
          <p className="mt-2 text-sm text-slate-600">최근 기록을 해석해 동기부여가 되는 문장으로 보여줍니다.</p>
        </div>
        <div className="rounded-full bg-emerald-100 p-3 text-emerald-600">
          <Sparkles className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-6 grid gap-4">
        {rising.map((player) => (
          <article key={player.id} className="rounded-[24px] bg-slate-950 p-5 text-white">
            <p className="text-sm text-slate-400">{player.name}</p>
            <p className="mt-3 text-lg font-semibold leading-8">
              최근 평균이 {player.averageImprovement}점 상승했고, 스페어율도 {player.spareImprovement}% 개선되어
              성장세가 뚜렷합니다.
            </p>
            <p className="mt-3 text-sm text-slate-400">
              추천: 후반 프레임 집중력 유지 훈련과 10번핀 처리 루틴을 계속 이어가세요.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
