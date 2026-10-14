"use client";

import type { ReactNode } from "react";
import { LuBoxes, LuFactory, LuLayers, LuPackage } from "react-icons/lu";
import type { Key } from "@/lib/i18n";
import { useT } from "./LanguageProvider";
import Reveal from "./Reveal";

const services: { code: "oem" | "odm" | "ckd" | "skd"; icon: ReactNode }[] = [
  { code: "oem", icon: <LuFactory /> },
  { code: "odm", icon: <LuLayers /> },
  { code: "ckd", icon: <LuBoxes /> },
  { code: "skd", icon: <LuPackage /> },
];

export default function Services() {
  const t = useT();

  return (
    <section id="services" className="relative w-full overflow-hidden border-t border-white/10 bg-neutral-900/50 px-6 py-14 md:px-12 md:py-32">
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[140px]" />

      <div className="relative">
        <Reveal>
          <p className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.35em] text-red-500">
            <span className="h-px w-10 bg-red-500" /> {t("services.eyebrow")}
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
            <h2 className="text-3xl font-bold leading-[1.15] tracking-tight sm:text-4xl md:text-5xl lg:col-span-7">
              {t("services.title")}
            </h2>
            <p className="text-base leading-relaxed text-white/60 md:text-lg lg:col-span-5">{t("services.intro")}</p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 md:mt-16 md:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.code} delay={i * 100} className="bg-neutral-950">
              <div className="group relative h-full p-7 transition-colors duration-300 hover:bg-neutral-900 md:p-10">
                <div className="flex items-start justify-between gap-4">
                  <span
                    dir="ltr"
                    className="bg-gradient-to-br from-red-500 to-orange-400 bg-clip-text text-5xl font-black tracking-tight text-transparent md:text-6xl"
                  >
                    {s.code.toUpperCase()}
                  </span>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-red-500/30 bg-red-500/10 text-xl text-red-500 transition-colors duration-300 group-hover:bg-red-600 group-hover:text-white">
                    {s.icon}
                  </div>
                </div>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  {t(`services.${s.code}.n` as Key)}
                </p>
                <h3 className="mt-6 text-xl font-semibold md:text-2xl">{t(`services.${s.code}.t` as Key)}</h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60 md:text-base">
                  {t(`services.${s.code}.d` as Key)}
                </p>
                <span className="absolute bottom-0 start-0 h-0.5 w-0 bg-red-500 transition-all duration-500 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
