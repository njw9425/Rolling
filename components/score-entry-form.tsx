"use client";

import type { FormEvent, ReactNode } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { summarizeDetailedFrames, validateDetailedFrames, type DetailedFrameInput } from "@/lib/frame-scoring";

type FormState = {
  playedAt: string;
  centerName: string;
  laneNumber: string;
  totalScore: string;
  strikeCount: string;
  spareCount: string;
  openCount: string;
  note: string;
};

type EntryMode = "quick" | "detailed";

type FrameDraft = {
  frameNumber: number;
  roll1: string;
  roll2: string;
  roll3: string;
  frameScore: string;
};

const initialState: FormState = {
  playedAt: "2026-03-12",
  centerName: "Red Pin Bowling Center",
  laneNumber: "7",
  totalScore: "",
  strikeCount: "",
  spareCount: "",
  openCount: "",
  note: ""
};

function createInitialFrames(): FrameDraft[] {
  return Array.from({ length: 10 }, (_, index) => ({
    frameNumber: index + 1,
    roll1: "",
    roll2: "",
    roll3: "",
    frameScore: ""
  }));
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950";

export function ScoreEntryForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [entryMode, setEntryMode] = useState<EntryMode>("quick");
  const [frames, setFrames] = useState<FrameDraft[]>(() => createInitialFrames());
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const parsedFrames = useMemo<DetailedFrameInput[] | null>(() => {
    if (frames.some((frame) => frame.roll1 === "" || frame.frameScore === "")) {
      return null;
    }

    return frames.map((frame) => ({
      frameNumber: frame.frameNumber,
      roll1: Number(frame.roll1),
      roll2: frame.roll2 === "" ? null : Number(frame.roll2),
      roll3: frame.roll3 === "" ? null : Number(frame.roll3),
      frameScore: Number(frame.frameScore)
    }));
  }, [frames]);

  const detailedValidation =
    entryMode === "detailed" && parsedFrames ? validateDetailedFrames(parsedFrames) : null;
  const detailedSummary =
    entryMode === "detailed" && parsedFrames && detailedValidation?.valid
      ? summarizeDetailedFrames(parsedFrames)
      : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const requestBody =
        entryMode === "detailed"
          ? buildDetailedRequest()
          : {
              playedAt: form.playedAt,
              centerName: form.centerName,
              laneNumber: form.laneNumber ? Number(form.laneNumber) : null,
              totalScore: Number(form.totalScore),
              strikeCount: Number(form.strikeCount),
              spareCount: Number(form.spareCount),
              openCount: Number(form.openCount),
              note: form.note,
              isDetailed: false
            };

      if (!requestBody) {
        setSubmitting(false);
        return;
      }

      const response = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });

      const payload = (await response.json()) as { message?: string };
      setMessage(payload.message ?? "Game log saved.");

      if (response.ok) {
        setForm((current) => ({
          ...initialState,
          playedAt: current.playedAt,
          centerName: current.centerName,
          laneNumber: current.laneNumber
        }));
        setFrames(createInitialFrames());
        setEntryMode("quick");
        router.refresh();
      }
    } catch {
      setMessage("Mock save is ready, but runtime verification still needs a local Node environment.");
    } finally {
      setSubmitting(false);
    }
  }

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateFrame(
    frameNumber: number,
    key: keyof Omit<FrameDraft, "frameNumber">,
    value: string
  ) {
    setFrames((current) =>
      current.map((frame) => (frame.frameNumber === frameNumber ? { ...frame, [key]: value } : frame))
    );
  }

  function buildDetailedRequest() {
    if (!parsedFrames) {
      setMessage("Fill in roll 1 and board score for all 10 frames before saving detailed mode.");
      return null;
    }

    const validation = validateDetailedFrames(parsedFrames);

    if (!validation.valid) {
      setMessage(validation.message);
      return null;
    }

    const summary = summarizeDetailedFrames(parsedFrames);

    return {
      playedAt: form.playedAt,
      centerName: form.centerName,
      laneNumber: form.laneNumber ? Number(form.laneNumber) : null,
      note: form.note,
      isDetailed: true,
      frames: parsedFrames,
      totalScore: summary.totalScore,
      strikeCount: summary.strikeCount,
      spareCount: summary.spareCount,
      openCount: summary.openCount
    };
  }

  return (
    <section className="panel-light p-6">
      <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="rounded-[28px] bg-slate-950 p-6 text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Quick Entry</p>
          <h2 className="mt-3 font-display text-3xl font-bold">Log today&apos;s game</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Use quick mode when you only want the final result, or detailed mode when someone wants full frame data from the scoreboard.
          </p>
          <div className="mt-6 grid gap-3">
            <Hint title="Feeds the growth score" text="Recent average, spare rate, strike rate, and participation bonus can all be derived from either mode." />
            <Hint title="Quick after club sessions" text="Admins can still input results fast when everyone just wants rankings updated right away." />
            <Hint title="Detailed when it matters" text="Frame mode stores rolls and board scores for games worth reviewing later." />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setEntryMode("quick")}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                entryMode === "quick"
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <p className="text-sm font-semibold">Quick input</p>
              <p className={`mt-1 text-sm ${entryMode === "quick" ? "text-slate-300" : "text-slate-500"}`}>
                Final score plus strike, spare, and open counts
              </p>
            </button>
            <button
              type="button"
              onClick={() => setEntryMode("detailed")}
              className={`rounded-2xl border px-4 py-3 text-left transition ${
                entryMode === "detailed"
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200 bg-white text-slate-700"
              }`}
            >
              <p className="text-sm font-semibold">Detailed input</p>
              <p className={`mt-1 text-sm ${entryMode === "detailed" ? "text-slate-300" : "text-slate-500"}`}>
                Roll-by-roll frames with scoreboard totals
              </p>
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Played on">
              <input type="date" value={form.playedAt} onChange={(e) => updateField("playedAt", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Bowling center">
              <input value={form.centerName} onChange={(e) => updateField("centerName", e.target.value)} className={inputClass} placeholder="Red Pin Bowling Center" />
            </Field>
            <Field label="Lane number">
              <input type="number" value={form.laneNumber} onChange={(e) => updateField("laneNumber", e.target.value)} className={inputClass} />
            </Field>
          </div>
          {entryMode === "quick" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Total score">
                  <input type="number" min={0} max={300} required value={form.totalScore} onChange={(e) => updateField("totalScore", e.target.value)} className={inputClass} placeholder="168" />
                </Field>
                <Field label="Strikes">
                  <input type="number" min={0} max={12} required value={form.strikeCount} onChange={(e) => updateField("strikeCount", e.target.value)} className={inputClass} />
                </Field>
                <Field label="Spares">
                  <input type="number" min={0} max={10} required value={form.spareCount} onChange={(e) => updateField("spareCount", e.target.value)} className={inputClass} />
                </Field>
                <Field label="Open frames">
                  <input type="number" min={0} max={10} required value={form.openCount} onChange={(e) => updateField("openCount", e.target.value)} className={inputClass} />
                </Field>
              </div>
            </>
          ) : (
            <div className="grid gap-4">
              <div className="grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 md:grid-cols-2 xl:grid-cols-3">
                <SummaryChip label="Score" value={detailedSummary ? String(detailedSummary.totalScore) : "-"} />
                <SummaryChip label="Strikes" value={detailedSummary ? String(detailedSummary.strikeCount) : "-"} />
                <SummaryChip label="Spares" value={detailedSummary ? String(detailedSummary.spareCount) : "-"} />
                <SummaryChip label="Open frames" value={detailedSummary ? String(detailedSummary.openCount) : "-"} />
                <SummaryChip label="Mode" value="Detailed" />
                <SummaryChip label="Validation" value={detailedValidation?.valid ? "Ready" : "Check frames"} />
              </div>
              {detailedValidation && !detailedValidation.valid ? (
                <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-700">{detailedValidation.message}</p>
              ) : null}
              <div className="grid gap-4 md:grid-cols-2">
                {frames.map((frame) => {
                  const isTenth = frame.frameNumber === 10;

                  return (
                    <div key={frame.frameNumber} className="rounded-[24px] border border-slate-200 p-4">
                      <p className="text-sm font-semibold text-slate-950">Frame {frame.frameNumber}</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <Field label="Roll 1">
                          <input
                            type="number"
                            min={0}
                            max={10}
                            value={frame.roll1}
                            onChange={(event) => updateFrame(frame.frameNumber, "roll1", event.target.value)}
                            className={inputClass}
                          />
                        </Field>
                        <Field label="Roll 2">
                          <input
                            type="number"
                            min={0}
                            max={10}
                            value={frame.roll2}
                            onChange={(event) => updateFrame(frame.frameNumber, "roll2", event.target.value)}
                            className={inputClass}
                            placeholder={frame.frameNumber < 10 ? "Leave empty for strike" : ""}
                          />
                        </Field>
                        {isTenth ? (
                          <Field label="Roll 3">
                            <input
                              type="number"
                              min={0}
                              max={10}
                              value={frame.roll3}
                              onChange={(event) => updateFrame(frame.frameNumber, "roll3", event.target.value)}
                              className={inputClass}
                              placeholder="Only after strike/spare"
                            />
                          </Field>
                        ) : null}
                        <Field label="Board score">
                          <input
                            type="number"
                            min={0}
                            max={300}
                            value={frame.frameScore}
                            onChange={(event) => updateFrame(frame.frameNumber, "frameScore", event.target.value)}
                            className={inputClass}
                            placeholder={frame.frameNumber === 10 ? "Final score" : "Cumulative score"}
                          />
                        </Field>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <Field label="Notes">
            <textarea
              value={form.note}
              onChange={(e) => updateField("note", e.target.value)}
              className={`${inputClass} min-h-28 resize-none`}
              placeholder="Lost focus in the last three frames. Missed the 10-pin twice."
            />
          </Field>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Quick mode is fastest after regular sessions. Detailed mode is best when someone wants deeper review from a notable game.
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Save game
            </button>
          </div>
          {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p> : null}
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function Hint({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}

function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}
