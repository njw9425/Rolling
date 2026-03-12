import type { ScoreRecord } from "@/lib/types";

export function GameHistoryTable({ records }: { records: ScoreRecord[] }) {
  return (
    <section className="panel-light p-6">
      <div>
        <h2 className="section-title">Recent game history</h2>
        <p className="mt-2 text-sm text-slate-600">
          Simple match logs still preserve the core data needed for growth calculations.
        </p>
      </div>
      <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-slate-950 text-white">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Center</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">STR</th>
              <th className="px-4 py-3">SPR</th>
              <th className="px-4 py-3">OPEN</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id} className="border-t border-slate-200 bg-white text-slate-700">
                <td className="px-4 py-3">{record.date}</td>
                <td className="px-4 py-3">{record.center}</td>
                <td className="px-4 py-3 font-semibold text-slate-950">
                  <div className="flex items-center gap-2">
                    <span>{record.score}</span>
                    {record.isDetailed ? (
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                        Detailed
                      </span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3">{record.strikes}</td>
                <td className="px-4 py-3">{record.spares}</td>
                <td className="px-4 py-3">{record.opens}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
