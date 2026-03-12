"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import type { ScoreRecord } from "@/lib/types";

export function ProfileTrendChart({ records }: { records: ScoreRecord[] }) {
  const chartData = [...records]
    .reverse()
    .map((record, index) => ({
      game: `G${index + 1}`,
      score: record.score,
      strikes: record.strikes,
      spares: record.spares
    }));

  return (
    <section className="panel-light p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="section-title">Recent trend</h2>
          <p className="mt-2 text-sm text-slate-600">
            Track score movement and spot whether your form is trending upward.
          </p>
        </div>
        <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Window</p>
          <p className="mt-1 font-semibold">{records.length} games</p>
        </div>
      </div>
      <div className="mt-6 h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#dbe5f0" strokeDasharray="4 4" />
            <XAxis dataKey="game" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Line type="monotone" dataKey="score" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="spares" stroke="#0f766e" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
