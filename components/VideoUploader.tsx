"use client";

import { upload } from "@vercel/blob/client";
import { useEffect, useRef, useState } from "react";

export default function VideoUploader() {
  const [url, setUrl] = useState<string | null>(null);
  const [mode, setMode] = useState("");
  const [busy, setBusy] = useState(false);
  const [pct, setPct] = useState(0);
  const [msg, setMsg] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/video", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setUrl(d.url);
        setMode(d.mode);
      });
  }, []);

  function password() {
    let pw = sessionStorage.getItem("qdt-pw");
    if (pw === null) {
      pw = prompt("Enter the admin password (leave empty if none is set)") ?? "";
      sessionStorage.setItem("qdt-pw", pw);
    }
    return pw;
  }

  async function onFile(file: File) {
    setBusy(true);
    setPct(0);
    setMsg("");
    const pw = password();
    try {
      let newUrl: string;
      if (mode === "vercel-blob") {
        const blob = await upload(`site/video/${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`, file, {
          access: "private",
          handleUploadUrl: "/api/video/upload",
          clientPayload: pw,
          multipart: true,
          onUploadProgress: (p) => setPct(Math.round(p.percentage)),
        });
        newUrl = `/api/blob?p=${encodeURIComponent(blob.pathname)}`;
        await fetch("/api/video", {
          method: "POST",
          headers: { "content-type": "application/json", "x-admin-password": pw },
          body: JSON.stringify({ keep: newUrl }),
        });
      } else {
        const form = new FormData();
        form.append("file", file);
        const r = await fetch("/api/video", { method: "POST", body: form, headers: { "x-admin-password": pw } });
        if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error ?? `HTTP ${r.status}`);
        newUrl = "/uploads/video/intro.mp4?t=" + Date.now();
      }
      setUrl(newUrl);
      setMsg("Video updated. It is now the landing page video.");
    } catch (e) {
      sessionStorage.removeItem("qdt-pw");
      setMsg(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="mb-14 rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-bold">Landing page video</h2>
      <p className="mt-1 text-sm text-white/50">MP4 or WebM, up to 300 MB. Uploading replaces the current video.</p>
      <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-center">
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-black md:w-80">
          {url ? (
            <video key={url} src={url} muted controls playsInline className="h-full w-full object-contain" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-white/40">No video uploaded yet</div>
          )}
        </div>
        <div>
          <input
            ref={input}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            hidden
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
          />
          <button
            disabled={busy}
            onClick={() => input.current?.click()}
            className="rounded-full bg-red-600 px-6 py-2.5 font-semibold hover:bg-red-500 disabled:opacity-50"
          >
            {busy ? (pct ? `Uploading ${pct}%` : "Uploading…") : url ? "Replace video" : "Upload video"}
          </button>
          {msg && <p className="mt-3 text-sm text-red-400">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
