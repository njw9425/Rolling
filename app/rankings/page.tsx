import { Rank } from "@/components/rank";
import { sortByAverage, sortByGrowth, sortByHighScore } from "@/lib/scoring";
import { getPlayerSummaries } from "@/lib/server-data";

export default async function RankingsPage() {
  const players = await getPlayerSummaries();
  const growth = sortByGrowth(players);

  const rankingTabs = [
    {
      title: "Growth score rankings",
      description: "Weighted by recent average gain, consistency, spare and strike improvement, and activity.",
      data: growth,
      accent: "from-gold/25 to-coral/10"
    },
    {
      title: "Average score rankings",
      description: "A snapshot of who is bowling the best right now.",
      data: sortByAverage(players),
      accent: "from-mint/25 to-sky-300/10"
    },
    {
      title: "High score rankings",
      description: "Shows the most explosive single-game performers in the club.",
      data: sortByHighScore(players),
      accent: "from-fuchsia-300/20 to-indigo-300/10"
    }
  ];

  return (
    <div className="page-shell">
      <section className="panel overflow-hidden">
        <div className="grid gap-6 bg-hero-glow p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
              Rolling Stones Ranking Center
            </p>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white">
              A ranking model
              <br />
              where improving members
              <br />
              can climb fast
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">
              High scores still matter, but the platform highlights growth so beginners and veterans both have a reason to come back.
            </p>
          </div>
          <div className="grid gap-4 rounded-[24px] border border-white/10 bg-white/10 p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Monthly MVP</p>
              <p className="mt-2 font-display text-3xl font-bold text-white">{growth[0]?.name ?? "No data yet"}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-slate-400">Growth</p>
                <p className="mt-1 text-xl font-semibold text-gold">{growth[0]?.growthScore ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-slate-400">Recent avg</p>
                <p className="mt-1 text-xl font-semibold text-white">{growth[0]?.recentAverage ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-slate-400">Gain</p>
                <p className="mt-1 text-xl font-semibold text-mint">+{growth[0]?.averageImprovement ?? 0}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="grid gap-6">
        {rankingTabs.map((tab) => (
          <div key={tab.title} className="panel-light overflow-hidden">
            <div className={`bg-gradient-to-r ${tab.accent} px-6 py-5`}>
              <h2 className="section-title">{tab.title}</h2>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">{tab.description}</p>
            </div>
            <div className="grid gap-4 p-5">
              {tab.data.map((player, index) => (
                <Rank key={`${tab.title}-${player.id}`} player={player} rank={index + 1} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
