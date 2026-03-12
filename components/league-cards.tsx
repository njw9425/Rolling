const leagueItems = [
  {
    title: "월간 성장왕",
    detail: "최근 5게임 대비 상승폭과 참여도를 종합해서 월별 MVP를 선정합니다."
  },
  {
    title: "정기 리그전",
    detail: "시즌 평균과 핸디캡을 함께 반영해 고수와 초보가 같이 경쟁할 수 있게 설계합니다."
  },
  {
    title: "토너먼트 이벤트",
    detail: "특정 날짜 이벤트전에 대진표를 자동 생성하고 결과를 시즌 히스토리에 저장합니다."
  }
];

export function LeagueCards() {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {leagueItems.map((item, index) => (
        <article key={item.title} className="panel-light p-6">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Mode 0{index + 1}</p>
          <h2 className="mt-3 font-display text-2xl font-bold text-slate-950">{item.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{item.detail}</p>
        </article>
      ))}
    </section>
  );
}
