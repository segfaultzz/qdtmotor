"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "./LanguageProvider";

type Img = { url: string; name: string; uploadedAt: string };

// Shrink big phone photos so they stay under Vercel's request size limit.
async function shrink(file: File, max = 2200): Promise<File> {
  if (file.type === "image/gif") return file;
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  if (scale === 1 && file.size < 3.5 * 1024 * 1024) return file;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  const blob: Blob = await new Promise((r) => canvas.toBlob((b) => r(b!), "image/jpeg", 0.85));
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
}

export default function Gallery({ admin = false }: { admin?: boolean }) {
  const [images, setImages] = useState<Img[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [drag, setDrag] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const t = useT();
  const [feat, setFeat] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(8);
  const rail = useRef<HTMLDivElement>(null);

  // Featured slideshow: advance every 5s unless hovered or the lightbox is open.
  useEffect(() => {
    if (admin || images.length < 2 || paused || open !== null) return;
    const id = setInterval(() => setFeat((f) => (f + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [admin, images.length, paused, open]);

  // Keep the active thumbnail in view inside the rail only (never scrolls the page).
  useEffect(() => {
    const el = rail.current?.children[feat] as HTMLElement | undefined;
    if (el && rail.current) {
      rail.current.scrollTo({ left: el.offsetLeft - rail.current.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
    }
  }, [feat]);

  const load = useCallback(async () => {
    const r = await fetch("/api/images", { cache: "no-store" });
    setImages((await r.json()).images ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch("/api/images", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setImages(d.images ?? []))
      .finally(() => setLoading(false));
  }, []);

  // Sends a request; if the server wants a password, ask once and retry.
  async function authed(send: (h: Record<string, string>) => Promise<Response>) {
    const saved = sessionStorage.getItem("qdt-pw");
    let r = await send(saved ? { "x-admin-password": saved } : {});
    if (r.status === 401) {
      const p = prompt("Enter the admin password");
      if (!p) return r;
      sessionStorage.setItem("qdt-pw", p);
      r = await send({ "x-admin-password": p });
      if (r.status === 401) sessionStorage.removeItem("qdt-pw");
    }
    return r;
  }

  async function upload(list: FileList | File[]) {
    const files = Array.from(list).filter((f) => f.type.startsWith("image/"));
    if (!files.length) return setMsg("Please choose image files.");
    setBusy(true);
    setMsg("");
    try {
      const form = new FormData();
      for (const f of files) form.append("files", await shrink(f));
      const r = await authed((headers) => fetch("/api/images", { method: "POST", body: form, headers }));
      const data = await r.json().catch(() => ({}));
      if (!r.ok) setMsg(data.error ?? `Upload failed (HTTP ${r.status})`);
      else {
        setMsg(`Uploaded ${data.images.length} image(s)`);
        await load();
      }
    } catch {
      setMsg("Upload failed. Try again.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  async function remove(url: string) {
    if (!confirm("Delete this image?")) return;
    const r = await authed((headers) =>
      fetch("/api/images", {
        method: "DELETE",
        headers: { "content-type": "application/json", ...headers },
        body: JSON.stringify({ url }),
      }),
    );
    if (!r.ok) return setMsg("Delete failed (wrong password?)");
    setOpen(null);
    load();
  }

  useEffect(() => {
    if (open === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, images.length]);

  return (
    <div>
      {admin && (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          upload(e.dataTransfer.files);
        }}
        onClick={() => input.current?.click()}
        className={`cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition ${
          drag ? "border-red-500 bg-red-500/10" : "border-white/20 bg-white/5 hover:border-red-500/60"
        }`}
      >
        <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files && upload(e.target.files)} />
        <p className="text-lg font-semibold text-white">{busy ? "Uploading…" : "Drop vehicle photos here or click to upload"}</p>
        <p className="mt-1 text-sm text-white/50">JPG, PNG, WebP — large photos are resized automatically</p>
        {msg && <p className="mt-3 text-sm text-red-400">{msg}</p>}
      </div>
      )}

      {loading ? (
        <div className="mt-6 space-y-4 md:mt-10">
          <div className="aspect-[4/3] animate-pulse bg-white/5 sm:aspect-[16/9]" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] animate-pulse bg-white/5" />
            ))}
          </div>
        </div>
      ) : images.length === 0 ? (
        <p className="mt-6 text-center text-white/50 md:mt-10">{admin ? "No photos yet — upload your first one above." : t("gallery.empty")}</p>
      ) : (
        <div className="mt-6 space-y-8 md:mt-10 md:space-y-10">
          {!admin && (
            <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
              {/* Featured photo */}
              <div className="group relative aspect-[4/3] overflow-hidden bg-neutral-900 ring-1 ring-white/10 sm:aspect-[16/9] lg:aspect-[2/1]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={images[feat].url}
                  src={images[feat].url}
                  alt={images[feat].name}
                  onClick={() => setOpen(feat)}
                  className="absolute inset-0 h-full w-full cursor-zoom-in object-cover duration-700 animate-in fade-in zoom-in-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 start-4 flex items-baseline gap-1 font-semibold tabular-nums text-white md:bottom-6 md:start-6">
                  <span className="text-3xl md:text-5xl">{String(feat + 1).padStart(2, "0")}</span>
                  <span className="text-sm text-white/60 md:text-base">/ {String(images.length).padStart(2, "0")}</span>
                </div>
                {images.length > 1 && (
                  <div className="absolute bottom-4 end-4 flex gap-2 md:bottom-6 md:end-6">
                    <button
                      onClick={() => setFeat((feat - 1 + images.length) % images.length)}
                      aria-label={t("gallery.prev")}
                      className="flex h-11 w-11 items-center justify-center border border-white/30 bg-black/40 text-xl text-white backdrop-blur transition hover:bg-red-600 rtl:rotate-180"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setFeat((feat + 1) % images.length)}
                      aria-label={t("gallery.next")}
                      className="flex h-11 w-11 items-center justify-center border border-white/30 bg-black/40 text-xl text-white backdrop-blur transition hover:bg-red-600 rtl:rotate-180"
                    >
                      ›
                    </button>
                  </div>
                )}
                {images.length > 1 && !paused && open === null && (
                  <div key={feat} className="absolute inset-x-0 bottom-0 h-0.5 bg-white/10">
                    <div className="gallery-progress h-full bg-red-500" />
                  </div>
                )}
              </div>

              {/* Thumbnail rail */}
              {images.length > 1 && (
                <div ref={rail} className="mt-3 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:thin]">
                  {images.map((img, i) => (
                    <button
                      key={img.url}
                      onClick={() => setFeat(i)}
                      aria-label={`${t("gallery.open")} ${i + 1}`}
                      className={`relative h-16 w-24 shrink-0 overflow-hidden transition md:h-20 md:w-32 ${
                        i === feat ? "ring-2 ring-red-500" : "opacity-50 hover:opacity-100"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img.url} alt="" loading="lazy" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* All photos */}
          <div>
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
              {!admin && <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white/60">{t("gallery.all")}</h3>}
              <p className={`text-sm text-white/40 ${admin ? "" : "ms-auto"}`}>
                {images.length === 1 ? t("gallery.count1") : t("gallery.count", { n: images.length })}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {images.slice(0, admin ? images.length : visible).map((img, i) => (
                <button
                  key={img.url}
                  onClick={() => setOpen(i)}
                  className="group relative aspect-[4/3] overflow-hidden bg-neutral-900 ring-1 ring-white/10"
                  aria-label={`${t("gallery.open")} ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-3 opacity-0 transition duration-300 group-hover:opacity-100">
                    <span className="text-sm font-semibold text-white">{t("gallery.view")}</span>
                  </div>
                </button>
              ))}
            </div>
            {!admin && visible < images.length && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setVisible((v) => v + 8)}
                  className="border border-white/25 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:border-red-500 hover:bg-red-600"
                >
                  {t("gallery.showMore")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {open !== null && images[open] && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur" onClick={() => setOpen(null)}>
          <div className="flex items-center justify-between px-5 py-4 text-white" onClick={(e) => e.stopPropagation()}>
            <span className="text-sm text-white/60">
              {open + 1} / {images.length}
            </span>
            <div className="flex items-center gap-3">
              {admin && (
                <button className="rounded-full bg-red-600 px-4 py-1.5 text-sm" onClick={() => remove(images[open].url)}>
                  Delete
                </button>
              )}
              <button className="text-3xl leading-none" onClick={() => setOpen(null)} aria-label={t("gallery.close")}>
                ×
              </button>
            </div>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4">
            {images.length > 1 && (
              <button
                className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-red-600 md:left-6"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((open - 1 + images.length) % images.length);
                }}
                aria-label={t("gallery.prev")}
              >
                ‹
              </button>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[open].url}
              alt={images[open].name}
              className="max-h-full max-w-full rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {images.length > 1 && (
              <button
                className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white transition hover:bg-red-600 md:right-6"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((open + 1) % images.length);
                }}
                aria-label={t("gallery.next")}
              >
                ›
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto px-5 py-4" onClick={(e) => e.stopPropagation()}>
            {images.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img.url}
                src={img.url}
                alt=""
                onClick={() => setOpen(i)}
                className={`h-16 w-24 shrink-0 cursor-pointer rounded-lg object-cover transition ${
                  i === open ? "opacity-100 ring-2 ring-red-500" : "opacity-50 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
