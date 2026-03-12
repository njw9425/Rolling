"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, Shield, UserRoundCheck, UserRoundX } from "lucide-react";
import type { MemberAdminSummary } from "@/lib/types";

type Props = {
  members: MemberAdminSummary[];
  currentUserId?: string;
};

export function ManageMembersPanel({ members, currentUserId }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(members);
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return items;
    }

    return items.filter((member) =>
      [member.name, member.email].some((value) => value.toLowerCase().includes(term))
    );
  }, [items, search]);

  async function updateMember(
    memberId: string,
    updates: {
      role?: "ADMIN" | "MEMBER";
      isActive?: boolean;
    }
  ) {
    setBusyId(memberId);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/users/${memberId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updates)
      });

      const payload = (await response.json()) as {
        message?: string;
        member?: {
          id: string;
          role: "ADMIN" | "MEMBER";
          isActive: boolean;
        };
      };

      if (!response.ok) {
        setMessage(payload.message ?? "Could not update that member.");
        return;
      }

      setItems((current) =>
        current.map((member) =>
          member.id === memberId
            ? {
                ...member,
                role: payload.member?.role ?? updates.role ?? member.role,
                isActive: payload.member?.isActive ?? updates.isActive ?? member.isActive
              }
            : member
        )
      );
      setMessage(payload.message ?? "Member updated.");
      router.refresh();
    } catch {
      setMessage("Member update failed. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="panel-light p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="section-title">Member management</h2>
          <p className="mt-2 text-sm text-slate-600">
            Change member roles, pause inactive accounts, and keep at least one active admin available.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name or email"
              className="rounded-full border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-slate-950"
            />
          </label>
          <div className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
            {filteredItems.length} shown
          </div>
        </div>
      </div>
      {message ? <p className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{message}</p> : null}
      <div className="mt-6 grid gap-4">
        {filteredItems.map((member) => {
          const isBusy = busyId === member.id;
          const isCurrentUser = member.id === currentUserId;

          return (
            <article key={member.id} className="rounded-[24px] border border-slate-200 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold text-slate-950">{member.name}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        member.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {member.isActive ? "Active" : "Inactive"}
                    </span>
                    {isCurrentUser ? (
                      <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                        You
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{member.email}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <Stat label="Games" value={String(member.totalGames)} />
                    <Stat label="Recent avg" value={member.recentAverage > 0 ? String(member.recentAverage) : "-"} />
                    <Stat label="Joined" value={member.createdAt} />
                  </div>
                  <p className="mt-3 text-sm text-slate-500">
                    Last game: {member.lastPlayedAt ?? "No games yet"}
                  </p>
                </div>
                <div className="flex min-w-64 flex-col gap-3">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Role
                    <div className="relative">
                      <Shield className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <select
                        value={member.role}
                        disabled={isBusy}
                        onChange={(event) =>
                          updateMember(member.id, {
                            role: event.target.value as "ADMIN" | "MEMBER"
                          })
                        }
                        className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-950 outline-none transition focus:border-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="ADMIN">Admin</option>
                        <option value="MEMBER">Member</option>
                      </select>
                    </div>
                  </label>
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => updateMember(member.id, { isActive: !member.isActive })}
                    className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      member.isActive ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {isBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : member.isActive ? (
                      <UserRoundX className="h-4 w-4" />
                    ) : (
                      <UserRoundCheck className="h-4 w-4" />
                    )}
                    {member.isActive ? "Deactivate account" : "Reactivate account"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-3">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  );
}
