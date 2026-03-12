import type { Route } from "next";
import Link from "next/link";
import { Activity, Medal, Target, TrendingUp } from "lucide-react";
import { GameHistoryTable } from "@/components/game-history-table";
import { PersonalSnapshot } from "@/components/personal-snapshot";
import { ProfileTrendChart } from "@/components/profile-trend-chart";
import { getSession } from "@/lib/auth";
import { getCurrentUserProfile } from "@/lib/server-data";

export default async function MePage() {
  const session = await getSession();
  const profile = await getCurrentUserProfile(session);

  if (!profile) {
    return (
      <div className="page-shell">
        <section className="panel-light p-8">
          <h1 className="section-title">My Bowling Profile</h1>
          <p className="mt-3 text-sm text-slate-600">
            Sign in first to see your personal growth dashboard and recent match history.
          </p>
          <Link
            href={"/login" as Route}
            className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white"
          >
            Go to login
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <section className="panel overflow-hidden">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
              Personal Dashboard
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white">
              {profile.name}
              <br />
              growth at a glance
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              This page focuses on what helps one member improve: recent average, growth score, technical rates, and recent game trend.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Metric icon={TrendingUp} label="Growth score" value={String(profile.growthScore)} />
            <Metric icon={Medal} label="Best score" value={String(profile.bestScore)} />
            <Metric icon={Target} label="Strike rate" value={`${profile.strikeRate}%`} />
            <Metric icon={Activity} label="Open rate" value={`${profile.openRate}%`} />
          </div>
        </div>
      </section>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <PersonalSnapshot profile={profile} />
        <ProfileTrendChart records={profile.recentGames} />
      </div>
      <GameHistoryTable records={profile.recentGames} />
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
      <Icon className="h-5 w-5 text-gold" />
      <p className="mt-4 text-sm text-slate-400">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
