const formulaItems = [
  { label: "Average gain", weight: "50%", detail: "Last 5-game average minus the previous 5-game average." },
  { label: "Spare improvement", weight: "20%", detail: "A strong signal that technical execution is getting better." },
  { label: "Strike improvement", weight: "15%", detail: "Captures added scoring power without dominating the model." },
  { label: "Consistency gain", weight: "10%", detail: "Rewards reduced score volatility over time." },
  { label: "Participation", weight: "5%", detail: "Adds a small bonus for members who keep logging games." }
];

export function GrowthFormula() {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/10 p-5">
      <div className="rounded-2xl bg-slate-950 p-5 text-white">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Formula</p>
        <p className="mt-3 font-display text-2xl font-bold">Growth Score = A + B + C + D + E</p>
      </div>
      <div className="mt-4 grid gap-3">
        {formulaItems.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-black/10 p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="font-semibold text-white">{item.label}</p>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gold">{item.weight}</span>
            </div>
            <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
