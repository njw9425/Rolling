"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Search, Trash2, X } from "lucide-react";
import type { ScoreRecord } from "@/lib/types";

type EditableForm = {
  id: string;
  playedAt: string;
  centerName: string;
  laneNumber: string;
  totalScore: string;
  strikeCount: string;
  spareCount: string;
  openCount: string;
  note: string;
};

type Props = {
  records: ScoreRecord[];
  title?: string;
  description?: string;
  showOwner?: boolean;
};

export function ManageGamesPanel({
  records,
  title = "Manage my records",
  description = "Fix typos, adjust scores, or remove duplicate entries without asking an admin.",
  showOwner = false
}: Props) {
  const router = useRouter();
  const [items, setItems] = useState(records);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<EditableForm | null>(null);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return items;
    }

    return items.filter((record) =>
      [record.center, record.ownerName ?? "", record.note ?? ""].some((value) =>
        value.toLowerCase().includes(term)
      )
    );
  }, [items, search]);

  function startEdit(record: ScoreRecord) {
    setEditingId(record.id);
    setMessage(null);
    setForm({
      id: record.id,
      playedAt: record.date,
      centerName: record.center,
      laneNumber: record.laneNumber ? String(record.laneNumber) : "",
      totalScore: String(record.score),
      strikeCount: String(record.strikes),
      spareCount: String(record.spares),
      openCount: String(record.opens),
      note: record.note ?? ""
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(null);
  }

  async function saveEdit() {
    if (!form) {
      return;
    }

    setBusyId(form.id);
    setMessage(null);

    try {
      const response = await fetch(`/api/games/${form.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playedAt: form.playedAt,
          centerName: form.centerName,
          laneNumber: form.laneNumber ? Number(form.laneNumber) : null,
          totalScore: Number(form.totalScore),
          strikeCount: Number(form.strikeCount),
          spareCount: Number(form.spareCount),
          openCount: Number(form.openCount),
          note: form.note
        })
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setMessage(payload.message ?? "Could not update the record.");
        return;
      }

      setItems((current) =>
        current.map((record) =>
          record.id === form.id
            ? {
                ...record,
                date: form.playedAt,
                center: form.centerName,
                laneNumber: form.laneNumber ? Number(form.laneNumber) : null,
                score: Number(form.totalScore),
                strikes: Number(form.strikeCount),
                spares: Number(form.spareCount),
                opens: Number(form.openCount),
                note: form.note
              }
            : record
        )
      );
      setMessage(payload.message ?? "Game updated.");
      cancelEdit();
      router.refresh();
    } catch {
      setMessage("Update failed. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function deleteRecord(recordId: string) {
    const confirmed = window.confirm("Delete this game record?");

    if (!confirmed) {
      return;
    }

    setBusyId(recordId);
    setMessage(null);

    try {
      const response = await fetch(`/api/games/${recordId}`, {
        method: "DELETE"
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setMessage(payload.message ?? "Could not delete the record.");
        return;
      }

      setItems((current) => current.filter((record) => record.id !== recordId));
      setMessage(payload.message ?? "Game deleted.");
      router.refresh();
    } catch {
      setMessage("Delete failed. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="panel-light p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="section-title">{title}</h2>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {showOwner ? (
            <label className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by member or center"
                className="rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-slate-950"
              />
            </label>
          ) : null}
          <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            {filteredItems.length} shown
          </div>
        </div>
      </div>
      {message ? <p className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{message}</p> : null}
      <div className="mt-6 grid gap-4">
        {filteredItems.map((record) => {
          const isEditing = editingId === record.id && form;
          const isBusy = busyId === record.id;

          return (
            <article key={record.id} className="rounded-[24px] border border-slate-200 p-5">
              {isEditing && form ? (
                <div className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Date">
                      <input
                        type="date"
                        value={form.playedAt}
                        onChange={(event) =>
                          setForm((current) => (current ? { ...current, playedAt: event.target.value } : current))
                        }
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Center">
                      <input
                        value={form.centerName}
                        onChange={(event) =>
                          setForm((current) => (current ? { ...current, centerName: event.target.value } : current))
                        }
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Lane">
                      <input
                        type="number"
                        value={form.laneNumber}
                        onChange={(event) =>
                          setForm((current) => (current ? { ...current, laneNumber: event.target.value } : current))
                        }
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Score">
                      <input
                        type="number"
                        value={form.totalScore}
                        onChange={(event) =>
                          setForm((current) => (current ? { ...current, totalScore: event.target.value } : current))
                        }
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Strikes">
                      <input
                        type="number"
                        value={form.strikeCount}
                        onChange={(event) =>
                          setForm((current) => (current ? { ...current, strikeCount: event.target.value } : current))
                        }
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Spares">
                      <input
                        type="number"
                        value={form.spareCount}
                        onChange={(event) =>
                          setForm((current) => (current ? { ...current, spareCount: event.target.value } : current))
                        }
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Open frames">
                      <input
                        type="number"
                        value={form.openCount}
                        onChange={(event) =>
                          setForm((current) => (current ? { ...current, openCount: event.target.value } : current))
                        }
                        className={inputClass}
                      />
                    </Field>
                  </div>
                  <Field label="Notes">
                    <textarea
                      value={form.note}
                      onChange={(event) =>
                        setForm((current) => (current ? { ...current, note: event.target.value } : current))
                      }
                      className={`${inputClass} min-h-24 resize-none`}
                    />
                  </Field>
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={saveEdit}
                      disabled={Boolean(isBusy)}
                      className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
                      Save changes
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {record.date} / {record.center} {record.laneNumber ? ` / Lane ${record.laneNumber}` : ""}
                    </p>
                    {showOwner && record.ownerName ? (
                      <p className="mt-2 text-sm font-semibold text-slate-700">{record.ownerName}</p>
                    ) : null}
                    <p className="mt-2 font-display text-3xl font-bold text-slate-950">{record.score}</p>
                    <p className="mt-2 text-sm text-slate-600">
                      STR {record.strikes} / SPR {record.spares} / OPEN {record.opens}
                    </p>
                    {record.isDetailed ? (
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        Detailed frame log
                      </p>
                    ) : null}
                    {record.note ? <p className="mt-3 text-sm text-slate-500">{record.note}</p> : null}
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => startEdit(record)}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteRecord(record.id)}
                      disabled={Boolean(isBusy)}
                      className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Field({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950";
