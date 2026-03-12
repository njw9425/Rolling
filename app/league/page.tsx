import { LeagueCards } from "@/components/league-cards";
import { monthlyEvents } from "@/lib/data";

export default function LeaguePage() {
  return (
    <div className="page-shell">
      <section className="panel overflow-hidden">
        <div className="grid gap-6 p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-coral/40 bg-coral/10 px-3 py-1 text-xs font-semibold text-coral">
              Season Play
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white">
              리그와 이벤트를 붙여서
              <br />
              재방문 이유를 만든 구조
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
              기록 사이트에서 멈추지 않고, 시즌전과 월간 성장왕 이벤트를 묶어서
              운영진도 관리하기 편하고 동아리원도 자주 들어오게 설계했습니다.
            </p>
          </div>
          <div className="grid gap-4 rounded-[24px] border border-white/10 bg-white/10 p-5">
            {monthlyEvents.map((event) => (
              <div key={event.id} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{event.date}</p>
                <p className="mt-2 text-lg font-semibold text-white">{event.title}</p>
                <p className="mt-2 text-sm text-slate-300">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <LeagueCards />
    </div>
  );
}
