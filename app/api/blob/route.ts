import { get } from "@vercel/blob";
import { NextRequest } from "next/server";
import { isAllowedPath } from "@/lib/storage";

// Streams a file from the private Blob store to the browser (supports Range for video seeking).
export async function GET(req: NextRequest) {
  const pathname = req.nextUrl.searchParams.get("p");
  if (!pathname || !isAllowedPath(pathname) || pathname.includes("..")) {
    return new Response("Not found", { status: 404 });
  }
  const range = req.headers.get("range");
  const result = await get(pathname, {
    access: "private",
    headers: range ? { range } : undefined,
  });
  if (!result || !result.stream) return new Response("Not found", { status: 404 });

  const headers = new Headers();
  headers.set("content-type", result.blob.contentType ?? result.headers.get("content-type") ?? "application/octet-stream");
  for (const h of ["content-length", "content-range", "etag"]) {
    const v = result.headers.get(h);
    if (v) headers.set(h, v);
  }
  headers.set("accept-ranges", "bytes");
  // Filenames get a random suffix on upload, so a given URL never changes.
  headers.set("cache-control", "public, max-age=31536000, s-maxage=31536000, immutable");
  return new Response(result.stream, { status: headers.has("content-range") ? 206 : 200, headers });
}
