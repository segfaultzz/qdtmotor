import Image from "next/image";

const WHATSAPP = "https://wa.me/8618079960724";
const ADDRESS = "No. 88-8 East Xihu Road, Houqiao Subdistrict, Xishan District, Wuxi City, Jiangsu Province, China";
const MAP_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(ADDRESS)}&z=15&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

const icon = "h-5 w-5 stroke-current";
const Svg = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={icon}>
    {children}
  </svg>
);

const rows: { label: string; icon: React.ReactNode; lines: { text: string; href?: string }[] }[] = [
  {
    label: "Address",
    icon: (
      <Svg>
        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </Svg>
    ),
    lines: [{ text: ADDRESS, href: MAP_LINK }],
  },
  {
    label: "Phone / WhatsApp",
    icon: (
      <Svg>
        <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
      </Svg>
    ),
    lines: [{ text: "+86 18079960724", href: WHATSAPP }],
  },
  {
    label: "WeChat",
    icon: (
      <Svg>
        <path d="M4 5h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      </Svg>
    ),
    lines: [{ text: "jieshidianmo" }, { text: "baozouxiaoyuangong" }],
  },
  {
    label: "Email",
    icon: (
      <Svg>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </Svg>
    ),
    lines: [{ text: "qdtmotors@gmail.com", href: "mailto:qdtmotors@gmail.com" }],
  },
];

export default function Contact() {
  return (
    <section id="contact" className="w-full border-t border-white/10 bg-neutral-900/60 px-6 pt-20 md:px-12 md:pt-32">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.35em] text-red-500">
            <span className="h-px w-10 bg-red-500" /> Contact
          </p>
          <h2 className="mt-6 text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl">
            Speak with our team.
          </h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/60 md:text-lg">
            Tell us what you are looking for. We reply on WhatsApp, WeChat and email, and you are welcome to visit us in Wuxi.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              className="bg-red-600 px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-red-500"
            >
              Chat on WhatsApp
            </a>
            <a
              href="mailto:qdtmotors@gmail.com"
              className="border border-white/25 px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:border-white hover:bg-white/5"
            >
              Send an email
            </a>
          </div>
        </div>

        <div className="lg:col-span-7">
          <dl className="divide-y divide-white/10 border-y border-white/10">
            {rows.map((r) => (
              <div key={r.label} className="grid gap-2 py-6 sm:grid-cols-[200px_1fr] sm:gap-6">
                <dt className="flex items-center gap-3 text-sm text-white/45">
                  <span className="text-red-500">{r.icon}</span>
                  {r.label}
                </dt>
                <dd className="space-y-1">
                  {r.lines.map((l) =>
                    l.href ? (
                      <a
                        key={l.text}
                        href={l.href}
                        target={l.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="block break-words text-base font-medium text-white/90 transition-colors hover:text-red-400"
                      >
                        {l.text}
                      </a>
                    ) : (
                      <p key={l.text} className="break-words text-base font-medium text-white/90">
                        {l.text}
                      </p>
                    ),
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-16 overflow-hidden border border-white/10">
        <iframe
          title="QDT Motor location"
          src={MAP_EMBED}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-72 w-full opacity-80 grayscale invert-[0.92] contrast-[0.9] md:h-96"
        />
      </div>

      <footer className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/10 py-10 md:flex-row">
        <Image src="/logo-white.png" alt="QDT Motor" width={954} height={834} className="h-16 w-auto opacity-80" />
        <p className="text-center text-xs text-white/40 md:text-right">© Qin Datou (Wuxi) Vehicle Industry Co., Ltd. All rights reserved.</p>
      </footer>
    </section>
  );
}
