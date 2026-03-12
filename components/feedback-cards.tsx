import type { PlayerSummary } from "@/lib/types";

const feedbackTexts = [
  "Late-frame drop-off is getting smaller, which suggests stronger match control.",
  "Spare improvement is now driving more growth than strike spikes.",
  "Three weeks of rising growth score suggests the practice routine is sticking."
];

export function FeedbackCards({ players }: { players: PlayerSummary[] }) {
  return (
    <section className="panel-light p-6">
      <div>
        <h2 className="section-title">Feedback examples</h2>
        <p className="mt-2 text-sm text-slate-600">
          In the real product, these messages can be generated from each player&apos;s recent game patterns.
        </p>
      </div>
      <div className="mt-6 grid gap-4">
        {players.slice(0, 3).map((player, index) => (
          <article key={player.id} className="rounded-[24px] bg-slate-950 p-5 text-white">
            <p className="text-sm text-slate-400">{player.name}</p>
            <p className="mt-3 text-lg font-semibold leading-8">{feedbackTexts[index]}</p>
            <p className="mt-3 text-sm text-slate-400">
              Suggested drills: 20 spare shots, frame 8-10 focus reps, and first-ball alignment checks.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
