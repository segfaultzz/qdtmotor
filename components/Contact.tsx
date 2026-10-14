"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { LuArrowUpRight, LuClock, LuMail, LuMapPin } from "react-icons/lu";
import { useT } from "./LanguageProvider";
import Reveal from "./Reveal";
import WeChatCard from "./WeChatCard";

const WHATSAPP = "https://wa.me/8618079960724";
const EMAIL = "qdtmotors@gmail.com";

const mapLink = (address: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

// Addresses are kept in English so couriers, maps and customers worldwide can all use them.
const locations = [
  {
    name: "Qin Datou (Wuxi) Vehicle Industry Co., Ltd",
    address: "No. 88-8 East Xihu Road, Houqiao Subdistrict, Xishan District, Wuxi City, Jiangsu Province, China",
  },
  {
    name: "Qin Datou Vehicle Industry",
    address: "No. 105 Qinghong Road, Ehu Town, Xishan District, Wuxi City, Jiangsu Province, China",
  },
];

const navLinks = [
  ["nav.gallery", "#gallery"],
  ["nav.about", "#about"],
  ["nav.contact", "#contact"],
] as const;

const cardBase = "group flex items-start gap-5 border border-white/10 bg-neutral-950/60 p-6 transition duration-300";
const cardLink = `${cardBase} items-center hover:-translate-y-0.5 hover:border-red-500/50 hover:bg-neutral-950`;

function IconBadge({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/5 text-2xl text-red-500 transition-colors duration-300 group-hover:border-red-500 group-hover:bg-red-600 group-hover:text-white">
      {children}
    </div>
  );
}

const Label = ({ children }: { children: ReactNode }) => (
  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">{children}</p>
);

export default function Contact() {
  const t = useT();

  return (
    <section id="contact" className="relative w-full overflow-hidden border-t border-white/10 bg-neutral-900/70 px-6 pt-24 md:px-12 md:pt-36">
      <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[140px]" />

      <div className="relative">
        <Reveal>
          <p className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.35em] text-red-500">
            <span className="h-px w-10 bg-red-500" /> {t("contact.eyebrow")}
          </p>
        </Reveal>

        {/* Call to action banner */}
        <Reveal delay={100}>
          <div className="relative mt-8 overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-red-950 px-8 py-14 md:px-16 md:py-20">
            <Image
              src="/logo-white.png"
              alt=""
              width={954}
              height={834}
              aria-hidden
              className="pointer-events-none absolute -end-16 top-1/2 h-[130%] w-auto -translate-y-1/2 opacity-[0.07]"
            />
            <div className="relative max-w-3xl">
              <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl md:text-6xl">{t("contact.title")}</h2>
              <p className="mt-5 max-w-xl text-base text-white/80 md:text-lg">{t("contact.text")}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={WHATSAPP}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 bg-white px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-neutral-950 transition hover:bg-neutral-200"
                >
                  <FaWhatsapp className="text-lg" /> {t("contact.whatsappBtn")}
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center gap-2.5 border border-white/50 px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-white/10"
                >
                  <LuMail className="text-lg" /> {t("contact.emailBtn")}
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Contact details + WeChat */}
        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="grid content-start gap-6 lg:col-span-7">
            <Reveal>
              <a href={WHATSAPP} target="_blank" rel="noreferrer" className={cardLink}>
                <IconBadge>
                  <FaWhatsapp />
                </IconBadge>
                <div className="min-w-0 flex-1">
                  <Label>{t("contact.whatsapp")}</Label>
                  <p dir="ltr" className="mt-1.5 text-start text-base font-medium text-white md:text-lg">
                    +86 18079960724
                  </p>
                </div>
                <span className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-red-400 transition-all duration-300 group-hover:gap-3 sm:inline-flex">
                  {t("contact.chat")} <LuArrowUpRight />
                </span>
              </a>
            </Reveal>

            <Reveal delay={100}>
              <a href={`mailto:${EMAIL}`} className={cardLink}>
                <IconBadge>
                  <LuMail />
                </IconBadge>
                <div className="min-w-0 flex-1">
                  <Label>{t("contact.email")}</Label>
                  <p dir="ltr" className="mt-1.5 break-words text-start text-base font-medium text-white md:text-lg">
                    {EMAIL}
                  </p>
                </div>
                <span className="hidden shrink-0 items-center gap-1.5 text-sm font-medium text-red-400 transition-all duration-300 group-hover:gap-3 sm:inline-flex">
                  {t("contact.send")} <LuArrowUpRight />
                </span>
              </a>
            </Reveal>

            <Reveal delay={200}>
              <div className={cardBase}>
                <IconBadge>
                  <LuMapPin />
                </IconBadge>
                <div className="min-w-0 flex-1">
                  <Label>{t("contact.visit")}</Label>
                  <div className="mt-3 divide-y divide-white/10">
                    {locations.map((l) => (
                      <a
                        key={l.address}
                        href={mapLink(l.address)}
                        target="_blank"
                        rel="noreferrer"
                        className="group/loc block py-4 first:pt-0 last:pb-0"
                      >
                        <p dir="ltr" className="text-start text-sm font-semibold text-white">
                          {l.name}
                        </p>
                        <p dir="ltr" className="mt-1 text-start text-sm leading-relaxed text-white/60">
                          {l.address}
                        </p>
                        <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-red-400 transition-all duration-300 group-hover/loc:gap-3">
                          {t("contact.maps")} <LuArrowUpRight />
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div className={cardBase}>
                <IconBadge>
                  <LuClock />
                </IconBadge>
                <div className="min-w-0 flex-1">
                  <Label>{t("contact.hours")}</Label>
                  <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <p className="text-base font-medium text-white md:text-lg">{t("contact.days")}</p>
                    <p dir="ltr" className="text-base font-semibold text-white md:text-lg">
                      08:00 – 17:00
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-white/40">{t("contact.tz")}</p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={150} className="lg:col-span-5">
            <WeChatCard />
          </Reveal>
        </div>

        <footer className="mt-24 flex flex-col items-center justify-between gap-8 border-t border-white/10 py-10 md:flex-row">
          <Image src="/logo-white.png" alt="QDT Motor" width={954} height={834} className="h-16 w-auto opacity-90" />
          <nav className="flex gap-8 text-sm text-white/50">
            {navLinks.map(([k, h]) => (
              <a key={k} href={h} className="transition-colors hover:text-white">
                {t(k)}
              </a>
            ))}
          </nav>
          <p className="text-center text-xs text-white/40 md:text-end">
            © Qin Datou (Wuxi) Vehicle Industry Co., Ltd. {t("contact.rights")}
          </p>
        </footer>
      </div>
    </section>
  );
}
