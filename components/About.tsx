const capabilities = [
  { n: "01", t: "Vehicle Supply", d: "A carefully selected range of vehicles, presented with accurate photos and clear information." },
  { n: "02", t: "Quality Assurance", d: "Every vehicle is checked before it is offered, so the condition you see is the condition you get." },
  { n: "03", t: "Customer Support", d: "A dedicated team on WhatsApp, WeChat and email, from first enquiry to final handover." },
  { n: "04", t: "Transparent Dealing", d: "Straightforward pricing and documentation, with no hidden surprises." },
];

const profile = [
  ["Company", "Qin Datou (Wuxi) Vehicle Industry Co., Ltd"],
  ["Brand", "QDT Motor"],
  ["Industry", "Vehicle Industry"],
  ["Location", "Wuxi, Jiangsu, China"],
];

export default function About() {
  return (
    <section id="about" className="w-full border-t border-white/10 bg-neutral-950 px-6 py-20 md:px-12 md:py-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <p className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.35em] text-red-500">
            <span className="h-px w-10 bg-red-500" /> About us
          </p>
          <h2 className="mt-6 text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl">
            Reliable vehicles, backed by people who care about getting it right.
          </h2>
          <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-white/60 md:text-lg">
            <p>
              QDT Motor is the brand of Qin Datou (Wuxi) Vehicle Industry Co., Ltd, based in Wuxi, Jiangsu Province.
              We work with customers to find the right vehicle and to make every step of the process clear and dependable.
            </p>
            <p>
              Our approach is simple: honest information, careful inspection and responsive communication. We would
              rather earn a long-term relationship than make a quick sale.
            </p>
          </div>
        </div>

        <aside className="lg:col-span-5">
          <div className="border border-white/10 bg-white/[0.03]">
            <div className="border-b border-white/10 px-6 py-4 text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
              Company profile
            </div>
            <dl className="divide-y divide-white/10">
              {profile.map(([k, v]) => (
                <div key={k} className="grid grid-cols-3 gap-4 px-6 py-4">
                  <dt className="text-sm text-white/40">{k}</dt>
                  <dd className="col-span-2 text-sm font-medium text-white/90">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>

      <div className="mt-20 grid border-l border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
        {capabilities.map((c) => (
          <div key={c.n} className="group border-b border-r border-white/10 p-8 transition-colors hover:bg-white/[0.03]">
            <span className="text-sm font-medium tabular-nums text-red-500">{c.n}</span>
            <h3 className="mt-6 text-lg font-semibold">{c.t}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/55">{c.d}</p>
            <div className="mt-6 h-px w-8 bg-white/20 transition-all duration-300 group-hover:w-16 group-hover:bg-red-500" />
          </div>
        ))}
      </div>
    </section>
  );
}
