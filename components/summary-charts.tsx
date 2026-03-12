"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PlayerSummary } from "@/lib/types";

const timeline = [
  { week: "1주", average: 136, growth: 42 },
  { week: "2주", average: 141, growth: 53 },
  { week: "3주", average: 145, growth: 61 },
  { week: "4주", average: 151, growth: 73 },
  { week: "5주", average: 154, growth: 80 }
];

export function SummaryCharts({ players }: { players: PlayerSummary[] }) {
  const leader = [...players].sort((a, b) => b.growthScore - a.growthScore)[0];

  return (
    <section className="panel-light p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="section-title">성장 추이</h2>
          <p className="mt-2 text-sm text-slate-600">최근 5주 기준 평균 점수와 성장 점수 추이입니다.</p>
        </div>
        <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Top Grower</p>
          <p className="mt-1 font-semibold">{leader.name}</p>
        </div>
      </div>
      <div className="mt-6 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={timeline}>
            <CartesianGrid stroke="#dbe5f0" strokeDasharray="4 4" />
            <XAxis dataKey="week" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Line type="monotone" dataKey="average" stroke="#0f766e" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="growth" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
