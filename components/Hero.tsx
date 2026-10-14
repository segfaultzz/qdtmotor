"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { LuMenu, LuX } from "react-icons/lu";
import LanguageSwitcher from "./LanguageSwitcher";
import { T } from "./LanguageProvider";

const links = [
  ["nav.gallery", "#gallery"],
  ["nav.services", "#services"],
  ["nav.about", "#about"],
  ["nav.contact", "#contact"],
] as const;

export default function Hero() {
  const [src, setSrc] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    fetch("/api/video")
      .then((r) => r.json())
      .then((d) => {
        setSrc(d.url);
        if (!d.url) window.dispatchEvent(new Event("hero-ready"));
      })
      .catch(() => window.dispatchEvent(new Event("hero-ready")));
  }, []);

  return (
    <header className="relative w-full bg-black">
      {/* Mobile: a solid bar above the video. sm and up: transparent, overlaid on the video. */}
      <nav className="relative z-30 flex items-center justify-between border-b border-white/10 bg-black px-4 py-2.5 sm:absolute sm:inset-x-0 sm:top-0 sm:border-0 sm:bg-transparent sm:px-6 sm:py-5 md:px-12">
        <a href="#" aria-label="QDT Motor home" onClick={() => setMenu(false)}>
          <Image src="/logo-white.png" alt="QDT Motor" width={954} height={834} priority className="h-11 w-auto sm:h-16 md:h-20" />
        </a>

        <div className="flex items-center gap-3 sm:gap-8">
          <div className="hidden gap-6 text-sm font-medium text-white/80 sm:flex lg:gap-8">
            {links.map(([k, h]) => (
              <a key={k} href={h} className="transition-colors hover:text-white">
                <T k={k} />
              </a>
            ))}
          </div>
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            aria-label="Menu"
            aria-expanded={menu}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-xl text-white sm:hidden"
          >
            {menu ? <LuX /> : <LuMenu />}
          </button>
        </div>

        {menu && (
          <div className="absolute inset-x-0 top-full border-b border-white/10 bg-black/95 px-4 pb-4 pt-2 backdrop-blur sm:hidden">
            {links.map(([k, h]) => (
              <a
                key={k}
                href={h}
                onClick={() => setMenu(false)}
                className="block border-b border-white/10 py-3.5 text-base font-medium text-white/90 last:border-0"
              >
                <T k={k} />
              </a>
            ))}
          </div>
        )}
      </nav>

      <div className="relative aspect-video max-h-svh w-full overflow-hidden">
        {src && (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={() => window.dispatchEvent(new Event("hero-ready"))}
            onError={() => window.dispatchEvent(new Event("hero-ready"))}
          />
        )}
        <div className="absolute inset-0 hidden bg-gradient-to-b from-black/50 via-transparent to-transparent sm:block" />
        <a
          href="#gallery"
          aria-label="Scroll down"
          className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 animate-bounce text-white/70 sm:block"
        >
          ↓
        </a>
      </div>
    </header>
  );
}
