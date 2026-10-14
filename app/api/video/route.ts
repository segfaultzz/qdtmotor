import { NextRequest } from "next/server";
import { deleteOldVideos, getVideoUrl, saveVideoLocal, storageMode } from "@/lib/storage";

function unauthorized(req: NextRequest) {
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && req.headers.get("x-admin-password") !== pw;
}

export async function GET() {
  try {
    return Response.json({ url: await getVideoUrl(), mode: storageMode });
  } catch (e) {
    return Response.json({ url: null, mode: storageMode, error: String(e) }, { status: 500 });
  }
}

// Local dev: multipart upload. Vercel: clean up old videos after a client upload.
export async function POST(req: NextRequest) {
  if (unauthorized(req)) return Response.json({ error: "Wrong password" }, { status: 401 });
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const { keep } = await req.json();
    if (typeof keep === "string") await deleteOldVideos(keep);
    return Response.json({ ok: true });
  }
  if (storageMode !== "local-disk") return Response.json({ error: "Use direct upload" }, { status: 400 });
  const file = (await req.formData()).get("file");
  if (!(file instanceof File) || !file.type.startsWith("video/")) {
    return Response.json({ error: "Choose a video file" }, { status: 400 });
  }
  await saveVideoLocal(file);
  return Response.json({ ok: true });
}
