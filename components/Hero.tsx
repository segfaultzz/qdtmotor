"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
  const [src, setSrc] = useState<string | null>(null);

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
    <section className="relative aspect-video max-h-svh w-full overflow-hidden bg-black">
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent" />
      <nav className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-3 sm:px-6 sm:py-5 md:px-12">
        <a href="#" aria-label="QDT Motor home">
          <Image src="/logo-white.png" alt="QDT Motor" width={954} height={834} priority className="h-9 w-auto sm:h-16 md:h-20" />
        </a>
        <div className="flex gap-4 text-xs font-medium text-white/80 sm:gap-8 sm:text-sm">
          <a href="#gallery" className="hover:text-white">Gallery</a>
          <a href="#about" className="hover:text-white">About</a>
          <a href="#contact" className="hover:text-white">Contact</a>
        </div>
      </nav>
      <a href="#gallery" aria-label="Scroll down" className="absolute bottom-6 left-1/2 hidden sm:block z-10 -translate-x-1/2 animate-bounce text-white/70">↓</a>
    </section>
  );
}
