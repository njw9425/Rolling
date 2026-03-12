import type { PlayerSummary } from "@/lib/types";

export function AnalysisBreakdown({ players }: { players: PlayerSummary[] }) {
  return (
    <section className="panel-light p-6">
      <div>
        <h2 className="section-title">Growth score breakdown</h2>
        <p className="mt-2 text-sm text-slate-600">
          Show which factors are pushing each member upward so the ranking feels fair and transparent.
        </p>
      </div>
      <div className="mt-6 grid gap-4">
        {players.map((player) => (
          <article key={player.id} className="rounded-[24px] border border-slate-200 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-slate-950">{player.name}</p>
                <p className="mt-1 text-sm text-slate-500">{player.badge}</p>
              </div>
              <div className="rounded-full bg-slate-950 px-3 py-1 text-sm font-semibold text-white">
                {player.growthScore} pts
              </div>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <BreakdownItem label="Average gain" value={`${Math.round(player.growthScore * 0.5)} pts`} />
              <BreakdownItem label="Spare rate gain" value={`${Math.round(player.growthScore * 0.2)} pts`} />
              <BreakdownItem label="Strike rate gain" value={`${Math.round(player.growthScore * 0.15)} pts`} />
              <BreakdownItem label="Consistency + activity" value={`${Math.round(player.growthScore * 0.15)} pts`} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BreakdownItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}
