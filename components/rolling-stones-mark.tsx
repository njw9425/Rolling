export function RollingStonesMark() {
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black px-6 py-7">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(148,163,184,0.22),transparent_24%),radial-gradient(circle_at_80%_15%,rgba(244,184,64,0.15),transparent_18%)]" />
      <div className="absolute -left-10 top-10 h-px w-32 rotate-[18deg] bg-white/25" />
      <div className="absolute right-0 top-6 h-px w-24 -rotate-[34deg] bg-white/25" />
      <div className="absolute bottom-10 right-10 h-px w-28 rotate-[24deg] bg-white/20" />
      <div className="absolute left-6 top-8 h-1.5 w-1.5 rounded-full bg-white/80" />
      <div className="absolute right-8 top-12 h-2 w-2 rounded-full bg-white/80" />
      <div className="relative">
        <p className="text-center text-xs font-semibold tracking-[0.28em] text-white/80">
          THE BOWLING CLUB
        </p>
        <div className="mt-3 text-center font-display text-5xl font-black uppercase leading-[0.86] tracking-tight text-white sm:text-6xl">
          <div>ROLLING</div>
          <div className="flex items-center justify-center gap-2">
            <span>ST</span>
            <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-black sm:h-14 sm:w-14">
              <span className="absolute left-[42%] top-[34%] h-1.5 w-1.5 rounded-full bg-black" />
              <span className="absolute left-[57%] top-[46%] h-1.5 w-1.5 rounded-full bg-black" />
              <span className="absolute left-[40%] top-[58%] h-1.5 w-1.5 rounded-full bg-black" />
            </span>
            <span>NES</span>
          </div>
        </div>
        <div className="mx-auto mt-5 h-px w-40 bg-white/15" />
        <p className="mt-4 text-center text-sm font-semibold text-white/85 sm:text-base">
          우주 최강 볼미새들 모임
        </p>
      </div>
    </div>
  );
}
