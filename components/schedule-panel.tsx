import { CalendarDays, MapPin, Users } from "lucide-react";
import type { EventSummary } from "@/lib/types";

export function SchedulePanel({ events }: { events: EventSummary[] }) {
  return (
    <section className="panel-light p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-title">이번 주 일정</h2>
          <p className="mt-2 text-sm text-slate-600">정기전과 번개 모집까지 홈에서 바로 확인합니다.</p>
        </div>
        <CalendarDays className="h-5 w-5 text-slate-400" />
      </div>
      <div className="mt-6 grid gap-4">
        {events.map((event) => (
          <article key={event.id} className="rounded-[24px] border border-slate-200 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{event.date}</p>
                <h3 className="mt-2 text-lg font-semibold text-slate-950">{event.title}</h3>
              </div>
              <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">{event.type}</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{event.description}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.location}
              </span>
              <span className="inline-flex items-center gap-2">
                <Users className="h-4 w-4" />
                {event.attendees}명 참여 예정
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
