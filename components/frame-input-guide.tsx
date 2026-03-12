const frameModes = [
  {
    title: "Quick entry",
    description: "Save the final score, strikes, spares, and open frames in a fast post-match flow."
  },
  {
    title: "Detailed entry",
    description: "Store each frame now with board scores so members can review detailed games without a slow setup."
  },
  {
    title: "Auto analysis",
    description: "Compare the last five games against the previous five and generate growth feedback."
  }
];

export function FrameInputGuide() {
  return (
    <div className="grid gap-4 rounded-[28px] border border-white/10 bg-white/10 p-5">
      {frameModes.map((mode, index) => (
        <div key={mode.title} className="rounded-2xl border border-white/10 bg-black/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Step 0{index + 1}</p>
          <p className="mt-2 text-lg font-semibold text-white">{mode.title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">{mode.description}</p>
        </div>
      ))}
    </div>
  );
}
