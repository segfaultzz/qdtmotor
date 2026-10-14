import Loader from "@/components/Loader";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import Contact from "@/components/Contact";
import { T } from "@/components/LanguageProvider";

export default function Home() {
  return (
    <main className="bg-neutral-950 text-white">
      <Loader />
      <Hero />

      <section id="gallery" className="w-full px-6 py-16 md:px-12 md:py-32">
        <p className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.35em] text-red-500">
          <span className="h-px w-10 bg-red-500" /> <T k="gallery.eyebrow" />
        </p>
        <h2 className="mb-10 mt-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"><T k="gallery.title" /></h2>
        <Gallery />
      </section>

      <About />
      <Contact />
    </main>
  );
}
