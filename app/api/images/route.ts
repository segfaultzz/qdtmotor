import { NextRequest } from "next/server";
import { deleteImage, listImages, saveImage, storageMode } from "@/lib/storage";

const MAX_BYTES = 4 * 1024 * 1024; // Vercel serverless body limit is ~4.5MB

function unauthorized(req: NextRequest) {
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && req.headers.get("x-admin-password") !== pw;
}

export async function GET() {
  try {
    return Response.json({ images: await listImages() });
  } catch (e) {
    return Response.json({ images: [], error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (unauthorized(req)) return Response.json({ error: "Wrong password" }, { status: 401 });
  const form = await req.formData();
  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (!files.length) return Response.json({ error: "No files" }, { status: 400 });
  const saved = [];
  for (const f of files) {
    if (!f.type.startsWith("image/")) return Response.json({ error: `${f.name} is not an image` }, { status: 400 });
    if (f.size > MAX_BYTES) return Response.json({ error: `${f.name} is too large (max 4MB)` }, { status: 413 });
    try {
      saved.push(await saveImage(f));
    } catch (e) {
      const hint =
        storageMode === "local-disk" && process.env.VERCEL
          ? "BLOB_READ_WRITE_TOKEN is missing: connect the Blob store to this project (Storage tab) and redeploy. "
          : "";
      return Response.json({ error: hint + (e instanceof Error ? e.message : String(e)) }, { status: 500 });
    }
  }
  return Response.json({ images: saved });
}

export async function DELETE(req: NextRequest) {
  if (unauthorized(req)) return Response.json({ error: "Wrong password" }, { status: 401 });
  const { url } = await req.json();
  if (typeof url !== "string") return Response.json({ error: "Missing url" }, { status: 400 });
  await deleteImage(url);
  return Response.json({ ok: true });
}
