"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { defaultLocale, detectLocale, dictionaries, locales, type Key, type Locale } from "@/lib/i18n";

// Tiny external store so the chosen language survives navigation and avoids hydration mismatches.
let current: Locale | null = null;
const listeners = new Set<() => void>();

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const getSnapshot = (): Locale => (current ??= detectLocale());
const getServerSnapshot = (): Locale => defaultLocale;

function chooseLocale(l: Locale) {
  current = l;
  try {
    localStorage.setItem("qdt-lang", l);
  } catch {}
  listeners.forEach((cb) => cb());
}

type Ctx = { locale: Locale; setLocale: (l: Locale) => void; t: (key: Key, vars?: Record<string, string | number>) => string };
const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const meta = locales.find((l) => l.code === locale)!;
    document.documentElement.lang = locale;
    document.documentElement.dir = meta.dir;
  }, [locale]);

  const t = useCallback<Ctx["t"]>(
    (key, vars) => {
      let s = dictionaries[locale][key] ?? dictionaries.en[key];
      if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
      return s;
    },
    [locale],
  );

  const value = useMemo(() => ({ locale, setLocale: chooseLocale, t }), [locale, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}

export const useT = () => useLanguage().t;

/** Translated text for use inside server components: <T k="nav.about" /> */
export function T({ k }: { k: Key }) {
  return <>{useT()(k)}</>;
}
