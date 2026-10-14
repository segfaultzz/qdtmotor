import Image from "next/image";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";

const pillars = [
  { t: "Quality Vehicles", d: "Every vehicle is carefully inspected and presented honestly, so you know exactly what you are getting." },
  { t: "Expert Service", d: "From the first conversation to the final handover, our team is with you at every step." },
  { t: "Fair & Transparent", d: "Clear pricing, clear paperwork and no surprises. We build relationships that last beyond the sale." },
];

const steps = [
  { n: "01", t: "Tell us what you need", d: "Share your budget, requirements and preferences with our team." },
  { n: "02", t: "We find the right match", d: "We shortlist vehicles that fit, and you can see them in our gallery." },
  { n: "03", t: "Drive away confident", d: "Inspection, paperwork and handover, handled properly." },
];

export default function Home() {
  return (
    <main className="bg-neutral-950 text-white">
      <Hero />

      <section id="gallery" className="w-full px-6 py-16 md:px-12 md:py-32">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-red-500">Gallery</p>
        <h2 className="mb-10 mt-3 text-3xl font-black sm:text-4xl md:text-6xl">Our vehicles</h2>
        <Gallery />
      </section>

      <section id="about" className="w-full bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 px-6 py-16 md:px-12 md:py-32">
        <div className="grid items-stretch gap-8 md:grid-cols-[1.4fr_1fr] md:gap-12">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-red-500">About QDT Motor</p>
            <h2 className="mt-3 text-4xl font-black leading-tight sm:text-5xl md:text-7xl">Your trusted partner on the road.</h2>
            <p className="mt-8 max-w-3xl text-xl leading-relaxed text-white/70">
              QDT Motor is dedicated to helping customers find, buy and enjoy the right vehicle. We
              combine hands-on automotive knowledge with a simple promise: be honest, be reliable and
              treat every customer like family.
            </p>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/60">
              Whether you are looking for your first vehicle or your next upgrade, we make the process
              straightforward, from choosing the vehicle to the moment you take the keys.
            </p>
          </div>
          <div className="flex items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-8 md:p-12">
            <Image src="/logo-white.png" alt="QDT Motor logo" width={954} height={834} className="h-auto w-full max-w-sm" />
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {pillars.map((f) => (
            <div key={f.t} className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:-translate-y-1 hover:border-red-500/50">
              <div className="mb-5 h-1 w-10 rounded bg-red-500" />
              <h3 className="text-xl font-bold">{f.t}</h3>
              <p className="mt-3 leading-relaxed text-white/60">{f.d}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-24 text-2xl font-black md:text-3xl">How it works</h3>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="border-t border-white/15 pt-6">
              <span className="text-4xl font-black text-red-500/80">{s.n}</span>
              <h4 className="mt-3 text-lg font-bold">{s.t}</h4>
              <p className="mt-2 text-white/60">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="border-t border-white/10 px-6 py-24 text-center">
        <h2 className="text-4xl font-black md:text-5xl">Ready to take a closer look?</h2>
        <p className="mt-4 text-white/60">Get in touch with our team today.</p>
        <a href="mailto:info@qdtmotors.com" className="mt-8 inline-block rounded-full bg-red-600 px-8 py-3 font-semibold hover:bg-red-500">
          info@qdtmotors.com
        </a>
        <Image src="/logo-white.png" alt="QDT Motor" width={954} height={834} className="mx-auto mt-16 h-24 w-auto opacity-80" />
        <p className="mt-4 text-sm text-white/30">© QDT Motor</p>
      </section>
    </main>
  );
}
