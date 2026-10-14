import { del, list, put } from "@vercel/blob";
import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

export type VehicleImage = { url: string; name: string; uploadedAt: string };

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
const LOCAL_DIR = path.join(process.cwd(), "public", "uploads");
const PREFIX = "vehicles/";

export const storageMode = useBlob ? "vercel-blob" : "local-disk";

export async function listImages(): Promise<VehicleImage[]> {
  let items: VehicleImage[];
  if (useBlob) {
    const { blobs } = await list({ prefix: PREFIX, limit: 500 });
    items = blobs.map((b) => ({
      url: b.url,
      name: b.pathname.slice(PREFIX.length),
      uploadedAt: b.uploadedAt.toISOString(),
    }));
  } else {
    await mkdir(LOCAL_DIR, { recursive: true });
    const files = await readdir(LOCAL_DIR);
    items = await Promise.all(
      files
        .filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f))
        .map(async (f) => ({
          url: `/uploads/${f}`,
          name: f,
          uploadedAt: (await stat(path.join(LOCAL_DIR, f))).mtime.toISOString(),
        })),
    );
  }
  return items.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

export async function saveImage(file: File): Promise<VehicleImage> {
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  if (useBlob) {
    const b = await put(PREFIX + safe, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
    });
    return { url: b.url, name: safe, uploadedAt: new Date().toISOString() };
  }
  await mkdir(LOCAL_DIR, { recursive: true });
  const name = `${Date.now()}-${safe}`;
  await writeFile(path.join(LOCAL_DIR, name), Buffer.from(await file.arrayBuffer()));
  return { url: `/uploads/${name}`, name, uploadedAt: new Date().toISOString() };
}

export async function deleteImage(url: string) {
  if (useBlob) return del(url);
  const name = path.basename(url);
  await unlink(path.join(LOCAL_DIR, name));
}

// ---- Landing page video ----
const VIDEO_PREFIX = "site/video/";
const LOCAL_VIDEO_DIR = path.join(LOCAL_DIR, "video");

export async function getVideoUrl(): Promise<string | null> {
  if (useBlob) {
    const { blobs } = await list({ prefix: VIDEO_PREFIX });
    const newest = blobs.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())[0];
    return newest?.url ?? null;
  }
  try {
    await stat(path.join(LOCAL_VIDEO_DIR, "intro.mp4"));
    return "/uploads/video/intro.mp4";
  } catch {
    return null;
  }
}

// Local dev only: on Vercel the browser uploads straight to Blob.
export async function saveVideoLocal(file: File) {
  await mkdir(LOCAL_VIDEO_DIR, { recursive: true });
  await writeFile(path.join(LOCAL_VIDEO_DIR, "intro.mp4"), Buffer.from(await file.arrayBuffer()));
}

// Remove every stored video except the one just uploaded.
export async function deleteOldVideos(keepUrl: string) {
  if (!useBlob) return;
  const { blobs } = await list({ prefix: VIDEO_PREFIX });
  const old = blobs.filter((b) => b.url !== keepUrl).map((b) => b.url);
  if (old.length) await del(old);
}
