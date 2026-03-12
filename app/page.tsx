import { DashboardHero } from "@/components/dashboard-hero";
import { InsightPanel } from "@/components/insight-panel";
import { LeaderboardPreview } from "@/components/leaderboard-preview";
import { MetricGrid } from "@/components/metric-grid";
import { SchedulePanel } from "@/components/schedule-panel";
import { SummaryCharts } from "@/components/summary-charts";
import { getClubSummaryData, getEvents, getPlayerSummaries } from "@/lib/server-data";

export default async function HomePage() {
  const players = await getPlayerSummaries();
  const summary = await getClubSummaryData(players);
  const events = await getEvents();

  return (
    <div className="page-shell">
      <DashboardHero />
      <MetricGrid summary={summary} />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <SummaryCharts players={players} />
        <LeaderboardPreview players={players} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <SchedulePanel events={events} />
        <InsightPanel players={players} />
      </div>
    </div>
  );
}
