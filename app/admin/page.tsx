import Link from "next/link";
import type { Route } from "next";
import { ShieldCheck, Users, Trophy, CalendarRange, Database } from "lucide-react";
import { ManageGamesPanel } from "@/components/manage-games-panel";
import { ManageMembersPanel } from "@/components/manage-members-panel";
import { LogoutButton } from "@/components/logout-button";
import { getSession } from "@/lib/auth";
import {
  getAdminManageableGames,
  getClubSummaryData,
  getEvents,
  getManageableMembers,
  getPlayerSummaries,
  getRecentClubGames
} from "@/lib/server-data";
import { isDatabaseConfigured } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN";
  const players = await getPlayerSummaries();
  const summary = await getClubSummaryData(players);
  const events = await getEvents();
  const recentGames = await getRecentClubGames();
  const adminGames = await getAdminManageableGames(session);
  const members = await getManageableMembers(session);

  const adminCards = [
    { label: "Tracked members", value: String(players.length), icon: Users },
    { label: "Weekly games", value: summary.weeklyGames, icon: Trophy },
    { label: "Events this month", value: String(events.length), icon: CalendarRange },
    { label: "Data mode", value: isDatabaseConfigured ? "Database" : "Demo", icon: Database }
  ] as const;

  return (
    <div className="page-shell">
      <section className="panel overflow-hidden">
        <div className="grid gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-mint/40 bg-mint/10 px-3 py-1 text-xs font-semibold text-mint">
              Admin Console
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white">
              Rolling Stones
              <br />
              club operations center
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              Use this space to track member activity, review rankings, and monitor whether the app is running in demo or real database mode.
            </p>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/10 p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-mint" />
              <p className="font-semibold text-white">
                {session ? `Signed in as ${session.name}` : "Not signed in"}
              </p>
            </div>
            <p className="mt-3 text-sm text-slate-300">
              {isAdmin
                ? "You have admin access in this session."
                : "Sign in with the demo captain account to unlock admin-only controls."}
            </p>
            {!session ? (
              <Link
                href={"/login" as Route}
                className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950"
              >
                Go to login
              </Link>
            ) : (
              <div className="mt-5">
                <LogoutButton />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {adminCards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className="panel-light p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{card.label}</p>
                  <p className="mt-3 font-display text-3xl font-bold text-slate-950">{card.value}</p>
                </div>
                <div className="rounded-2xl bg-slate-950 p-3 text-white">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="panel-light p-6">
          <h2 className="section-title">Live admin checklist</h2>
          <div className="mt-5 grid gap-3">
            <ChecklistItem done={Boolean(session)} text="Authentication flow is wired" />
            <ChecklistItem done={isDatabaseConfigured} text="DATABASE_URL detected for real writes" />
            <ChecklistItem done={Boolean(session && isAdmin)} text="Admin session available" />
            <ChecklistItem done={players.length > 0} text="Ranking data is available" />
          </div>
        </section>

        <section className="panel-light p-6">
          <h2 className="section-title">Recent club game logs</h2>
          <div className="mt-5 grid gap-3">
            {recentGames.slice(0, 4).map((game) => (
              <div key={game.id} className="rounded-2xl border border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-950">
                  {game.center} / {game.score}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  STR {game.strikes}, SPR {game.spares}, OPEN {game.opens}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="panel-light p-6">
          <h2 className="section-title">Current leaders</h2>
          <div className="mt-5 grid gap-3">
            {players.slice(0, 5).map((player) => (
              <div key={player.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-950">{player.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{player.badge}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-950">{player.growthScore} pts</p>
                    <p className="text-sm text-emerald-600">+{player.averageImprovement} avg</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel-light p-6">
          <h2 className="section-title">Season notes</h2>
          <div className="mt-5 grid gap-3">
            <NoteItem label="Season leader" value={summary.seasonLeader} />
            <NoteItem label="Club average" value={summary.averageScore} />
            <NoteItem label="Improving members" value={summary.improvedMembers} />
            <NoteItem label="Upcoming feature" value="Ranking policy editor" />
          </div>
        </section>
      </div>

      {isAdmin ? (
        <ManageMembersPanel members={members} currentUserId={session?.userId} />
      ) : null}

      {isAdmin ? (
        <ManageGamesPanel
          records={adminGames}
          title="All club game records"
          description="Search by member or bowling center, then edit or delete records as an admin."
          showOwner
        />
      ) : null}
    </div>
  );
}

function ChecklistItem({ done, text }: { done: boolean; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
      <div className={`h-3 w-3 rounded-full ${done ? "bg-emerald-500" : "bg-slate-300"}`} />
      <p className="text-sm text-slate-700">{text}</p>
    </div>
  );
}

function NoteItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  );
}
