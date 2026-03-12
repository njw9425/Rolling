import Link from "next/link";
import { ArrowRight, Medal, Sparkles, Target } from "lucide-react";
import { RollingStonesMark } from "@/components/rolling-stones-mark";

export function DashboardHero() {
  return (
    <section className="panel grid-fade overflow-hidden">
      <div className="grid gap-8 bg-hero-glow p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
        <div>
          <p className="mb-4 inline-flex rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            The Bowling Club Rolling Stones
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Compete by growth,
            <br />
            not only by high scores
            <br />
            in Rolling Stones
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Match logging, growth charts, monthly MVP, league management, and feedback cards
            are combined into one data-driven bowling club platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/record"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
            >
              Log a game
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/rankings"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              View rankings
            </Link>
          </div>
        </div>
        <div className="grid gap-4">
          <RollingStonesMark />
          <div className="rounded-[28px] border border-white/10 bg-white/10 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gold/15 p-3 text-gold">
                <Medal className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Monthly top grower</p>
                <p className="text-xs text-slate-400">Based on the last 5 games</p>
              </div>
            </div>
            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="font-display text-3xl font-bold text-white">Kim Dohyeon</p>
                <p className="text-sm text-mint">Growth score 87</p>
              </div>
              <div className="rounded-full border border-mint/30 bg-mint/10 px-3 py-1 text-xs font-semibold text-mint">
                +18 avg gain
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
              <Sparkles className="h-5 w-5 text-gold" />
              <p className="mt-4 text-sm text-slate-400">Active members</p>
              <p className="mt-1 font-display text-3xl font-bold text-white">42</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
              <Target className="h-5 w-5 text-mint" />
              <p className="mt-4 text-sm text-slate-400">Games this month</p>
              <p className="mt-1 font-display text-3xl font-bold text-white">186</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
