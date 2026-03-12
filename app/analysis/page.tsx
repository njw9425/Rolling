import { AnalysisBreakdown } from "@/components/analysis-breakdown";
import { FeedbackCards } from "@/components/feedback-cards";
import { GrowthFormula } from "@/components/growth-formula";
import { getPlayerSummaries } from "@/lib/server-data";

export default async function AnalysisPage() {
  const players = await getPlayerSummaries();

  return (
    <div className="page-shell">
      <section className="panel overflow-hidden">
        <div className="grid gap-6 p-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-mint/40 bg-mint/10 px-3 py-1 text-xs font-semibold text-mint">
              Insight Engine
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white">
              Growth scoring
              <br />
              that members can
              <br />
              actually trust
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
              Good competition systems feel transparent. This page explains how average gains, technical improvement, consistency, and activity combine.
            </p>
          </div>
          <GrowthFormula />
        </div>
      </section>
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <AnalysisBreakdown players={players} />
        <FeedbackCards players={players} />
      </div>
    </div>
  );
}
