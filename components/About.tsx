"use client";

import Image from "next/image";
import { LuCar, LuHandshake, LuHeadset, LuShieldCheck } from "react-icons/lu";
import { useT } from "./LanguageProvider";
import Reveal from "./Reveal";

const capabilities = [
  { icon: <LuCar />, t: "about.cap1t", d: "about.cap1d" },
  { icon: <LuShieldCheck />, t: "about.cap2t", d: "about.cap2d" },
  { icon: <LuHeadset />, t: "about.cap3t", d: "about.cap3d" },
  { icon: <LuHandshake />, t: "about.cap4t", d: "about.cap4d" },
] as const;

export default function About() {
  const t = useT();
  const profile = [
    [t("about.company"), "Qin Datou (Wuxi) Vehicle Industry Co., Ltd"],
    [t("about.brand"), "QDT Motor"],
    [t("about.industry"), t("about.industryVal")],
    [t("about.hq"), t("about.hqVal")],
  ];

  return (
    <section id="about" className="relative w-full overflow-hidden border-t border-white/10 bg-neutral-950 px-6 py-24 md:px-12 md:py-36">
      {/* atmosphere: soft red glow */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[600px] w-[600px] rounded-full bg-red-600/15 blur-[140px]" />

      <div className="relative">
        <Reveal>
          <p className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.35em] text-red-500">
            <span className="h-px w-10 bg-red-500" /> {t("about.eyebrow")}
          </p>
          <h2 className="mt-6 max-w-5xl text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-7xl">
            {t("about.t1")}{" "}
            <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">{t("about.t2")}</span>
            <br className="hidden md:block" /> {t("about.t3")}
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-7">
            <p className="border-s-2 border-red-500 ps-6 text-xl font-medium leading-relaxed text-white/90 md:text-2xl">
              {t("about.lead")}
            </p>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-white/60 md:text-lg">
              <p>{t("about.p1")}</p>
              <p>{t("about.p2")}</p>
            </div>
          </Reveal>

          <Reveal delay={150} className="lg:col-span-5">
            <div className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] shadow-2xl shadow-black/40">
              <div className="h-1 w-full bg-gradient-to-r from-red-600 to-orange-500" />
              <Image
                src="/logo-white.png"
                alt=""
                width={954}
                height={834}
                aria-hidden
                className="pointer-events-none absolute -bottom-10 -end-10 h-64 w-auto opacity-[0.05]"
              />
              <div className="relative p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/45">{t("about.profile")}</p>
                <dl className="mt-6 divide-y divide-white/10">
                  {profile.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-5 gap-4 py-4">
                      <dt className="col-span-2 text-sm text-white/40">{k}</dt>
                      <dd className="col-span-3 text-sm font-medium text-white">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-24 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((c, i) => (
            <Reveal key={c.t} delay={i * 100} className="bg-neutral-950">
              <div className="group relative h-full p-8 transition-colors duration-300 hover:bg-neutral-900">
                <div className="flex h-12 w-12 items-center justify-center border border-red-500/30 bg-red-500/10 text-xl text-red-500 transition-colors duration-300 group-hover:bg-red-600 group-hover:text-white">
                  {c.icon}
                </div>
                <h3 className="mt-8 text-lg font-semibold">{t(c.t)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{t(c.d)}</p>
                <span className="absolute bottom-0 start-0 h-0.5 w-0 bg-red-500 transition-all duration-500 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
