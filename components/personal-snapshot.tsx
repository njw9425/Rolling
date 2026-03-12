import type { UserProfileSummary } from "@/lib/types";

export function PersonalSnapshot({ profile }: { profile: UserProfileSummary | null }) {
  if (!profile) {
    return (
      <section className="panel-light p-6">
        <div>
          <h2 className="section-title">Personal Snapshot</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to see your own average, growth score, and recent bowling stats.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="panel-light p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="section-title">{profile.name}</h2>
          <p className="mt-2 text-sm text-slate-600">
            {profile.badge} / {profile.role}
          </p>
        </div>
        <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
          Growth {profile.growthScore}
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <MiniMetric label="Recent average" value={String(profile.recentAverage)} />
        <MiniMetric label="Previous average" value={String(profile.previousAverage)} />
        <MiniMetric label="Best score" value={String(profile.bestScore)} />
        <MiniMetric label="Total games" value={String(profile.totalGames)} />
        <MiniMetric label="Strike rate" value={`${profile.strikeRate}%`} />
        <MiniMetric label="Spare rate" value={`${profile.spareRate}%`} />
      </div>
    </section>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-slate-950">{value}</p>
    </div>
  );
}
