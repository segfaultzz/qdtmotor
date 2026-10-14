"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const MIN_MS = 1400; // always show the animation briefly, so it never just flashes
const MAX_MS = 8000; // never block the site for longer than this

// Full-screen splash shown until the page and the hero video are ready.
export default function Loader() {
  const [phase, setPhase] = useState<"show" | "hide" | "gone">("show");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const start = Date.now();
    let pageLoaded = document.readyState === "complete";
    let heroReady = false;
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      setTimeout(() => {
        setPhase("hide");
        document.body.style.overflow = "";
        setTimeout(() => setPhase("gone"), 800);
      }, Math.max(0, MIN_MS - (Date.now() - start)));
    };
    const check = () => pageLoaded && heroReady && finish();

    const onLoad = () => {
      pageLoaded = true;
      check();
    };
    const onHero = () => {
      heroReady = true;
      check();
    };

    if (!pageLoaded) window.addEventListener("load", onLoad);
    window.addEventListener("hero-ready", onHero);
    const max = setTimeout(finish, MAX_MS);

    return () => {
      window.removeEventListener("load", onLoad);
      window.removeEventListener("hero-ready", onHero);
      clearTimeout(max);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden={phase === "hide"}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-700 ${
        phase === "hide" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <Image src="/logo-white.png" alt="QDT Motor" width={954} height={834} priority className="loader-logo h-40 w-auto md:h-56" />
      <div className="relative mt-8 h-[3px] w-48 overflow-hidden rounded-full bg-white/10">
        <div className="loader-bar absolute inset-y-0 left-0 w-1/3 rounded-full bg-red-500" />
      </div>
    </div>
  );
}
