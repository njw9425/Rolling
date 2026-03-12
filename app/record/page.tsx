import { FrameInputGuide } from "@/components/frame-input-guide";
import { GameHistoryTable } from "@/components/game-history-table";
import { ManageGamesPanel } from "@/components/manage-games-panel";
import { PersonalSnapshot } from "@/components/personal-snapshot";
import { ScoreEntryForm } from "@/components/score-entry-form";
import { getSession } from "@/lib/auth";
import { getCurrentUserProfile, getRecentScoreRecords } from "@/lib/server-data";

export default async function RecordPage() {
  const session = await getSession();
  const profile = await getCurrentUserProfile(session);
  const records = await getRecentScoreRecords(session);

  return (
    <div className="page-shell">
      <section className="panel overflow-hidden">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
              Match Logging
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white">
              Fast input,
              <br />
              deeper data underneath
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
              The simple entry flow keeps the experience light for members while still collecting enough data for rankings and growth analysis.
            </p>
          </div>
          <FrameInputGuide />
        </div>
      </section>
      <ScoreEntryForm />
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <PersonalSnapshot profile={profile} />
        {session ? <ManageGamesPanel records={records} /> : <GameHistoryTable records={records} />}
      </div>
    </div>
  );
}
