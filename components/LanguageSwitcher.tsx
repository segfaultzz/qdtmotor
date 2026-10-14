"use client";

import { useEffect, useRef, useState } from "react";
import { LuCheck, LuChevronDown, LuGlobe } from "react-icons/lu";
import { locales } from "@/lib/i18n";
import { useLanguage } from "./LanguageProvider";

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const current = locales.find((l) => l.code === locale)!;

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("lang.label")}
        className="flex items-center gap-1.5 rounded-full border border-white/25 bg-black/30 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:border-white/60 sm:text-sm"
      >
        <LuGlobe className="text-base" />
        <span>{current.short}</span>
        <LuChevronDown className={`text-sm transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute end-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-white/15 bg-neutral-950/95 py-1 shadow-2xl shadow-black/50 backdrop-blur"
        >
          {locales.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                role="option"
                aria-selected={l.code === locale}
                onClick={() => {
                  setLocale(l.code);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-4 py-2.5 text-start text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                {l.name}
                {l.code === locale && <LuCheck className="text-red-500" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
