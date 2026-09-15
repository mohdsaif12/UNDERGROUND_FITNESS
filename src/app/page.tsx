import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex flex-col relative w-full pt-20 pb-24 bg-[#131313] min-h-screen">
      <div className="flex flex-col w-full px-4 pb-10 max-w-md mx-auto">
        {/* Ambient Glow */}
        <div className="relative w-full flex flex-col items-center">
          <div className="absolute -top-6 w-48 h-48 bg-[#caf300]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Monolithic Logo Slab */}
          <div className="relative z-10 flex flex-col items-center mt-4 mb-6">
            <div className="relative p-1 rounded-xl bg-[#2a2a2a] shadow-lg">
              <div className="w-24 h-24 rounded-lg bg-[#0e0e0e] flex items-center justify-center p-2 overflow-hidden shadow-inner border border-[#2a2a2a]">
                <div className="w-full h-full flex flex-col items-center justify-center text-[#caf300]">
                  <span className="material-symbols-outlined text-[42px]">fitness_center</span>
                </div>
              </div>
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-[#caf300] rounded shadow-sm flex items-center gap-1 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2a3400] animate-ping" />
                <span className="font-label-sm text-[10px] text-[#2a3400] uppercase tracking-wider font-bold">
                  Gym Lab
                </span>
              </div>
            </div>
          </div>

          {/* Editorial Typography Stack */}
          <div className="w-full text-center space-y-2 mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2a2a2a] mb-1">
              <span className="material-symbols-outlined text-[14px] text-[#bfd42e]">bolt</span>
              <span className="font-label-sm text-[10px] uppercase tracking-widest text-[#c5c9ac] font-bold">
                Underground x Jimmy
              </span>
            </div>
            <h1 className="font-display-mobile text-[38px] uppercase text-white tracking-tight leading-tight font-black">
              Train Hard.<br />
              <span className="text-[#caf300]">Refuel Fast.</span>
            </h1>
            <p className="font-body-md text-[14px] text-[#c5c9ac] max-w-xs mx-auto pt-1 leading-relaxed">
              Quick-order targeted nutrition, protein blends &amp; recovery meals delivered straight to the pickup counter while you train.
            </p>
          </div>

          {/* Minimal Industrial Feature Rail */}
          <div className="w-full flex flex-col gap-2.5 mb-8">
            {/* Feature 1 */}
            <div className="flex items-center justify-between px-4 py-3.5 rounded bg-[#1c1b1b] border border-[#2a2a2a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#2a2a2a] flex items-center justify-center text-[#caf300]">
                  <span className="material-symbols-outlined text-[18px]">timer</span>
                </div>
                <div>
                  <div className="font-label-md text-[12px] uppercase text-white tracking-wide font-bold">Order Between Sets</div>
                  <div className="font-label-sm text-[10px] text-[#c5c9ac] uppercase">30-second checkout flow</div>
                </div>
              </div>
              <span className="font-label-sm text-[10px] text-[#caf300] bg-[#2a2a2a] px-2 py-0.5 rounded font-bold">01</span>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center justify-between px-4 py-3.5 rounded bg-[#1c1b1b] border border-[#2a2a2a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#2a2a2a] flex items-center justify-center text-[#caf300]">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                </div>
                <div>
                  <div className="font-label-md text-[12px] uppercase text-white tracking-wide font-bold">Ready At Cooldown</div>
                  <div className="font-label-sm text-[10px] text-[#c5c9ac] uppercase">Chilled &amp; prepped on cue</div>
                </div>
              </div>
              <span className="font-label-sm text-[10px] text-[#caf300] bg-[#2a2a2a] px-2 py-0.5 rounded font-bold">02</span>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center justify-between px-4 py-3.5 rounded bg-[#1c1b1b] border border-[#2a2a2a]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#2a2a2a] flex items-center justify-center text-[#caf300]">
                  <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
                </div>
                <div>
                  <div className="font-label-md text-[12px] uppercase text-white tracking-wide font-bold">Instant Counter Token</div>
                  <div className="font-label-sm text-[10px] text-[#c5c9ac] uppercase">Express tap-and-grab station</div>
                </div>
              </div>
              <span className="font-label-sm text-[10px] text-[#caf300] bg-[#2a2a2a] px-2 py-0.5 rounded font-bold">03</span>
            </div>
          </div>

          {/* Action Section */}
          <div className="w-full flex flex-col gap-3">
            <Link
              href="/menu"
              className="w-full h-14 rounded bg-[#caf300] hover:bg-[#b0d500] text-[#2a3400] font-headline-sm text-lg uppercase tracking-wide flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(202,243,0,0.25)] active:scale-[0.98] transition-all font-black"
            >
              <span>Enter Jimmy Cafe</span>
              <span className="material-symbols-outlined text-[24px]">arrow_forward</span>
            </Link>

            <Link
              href="/orders"
              className="w-full h-12 rounded bg-[#2a2a2a] hover:bg-[#353534] text-white font-label-md text-[12px] uppercase tracking-wider flex items-center justify-center gap-2 transition-all font-bold"
            >
              <span className="material-symbols-outlined text-[18px] text-[#bfd42e]">receipt_long</span>
              <span>View Order History</span>
            </Link>

            {/* Machine Status Strip */}
            <div className="mt-1 flex items-center justify-between px-3 py-2 rounded bg-[#0e0e0e] border border-[#2a2a2a]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#bfd42e]" />
                <span className="font-label-sm text-[10px] uppercase text-[#c5c9ac]">Station B • Gym Floor Deck</span>
              </div>
              <span className="font-label-sm text-[10px] uppercase text-[#bfd42e] font-bold">Avg Prep 3.2m</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

