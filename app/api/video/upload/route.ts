import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextRequest } from "next/server";

// Issues a short-lived token so the browser can upload large videos straight to Blob,
// bypassing the serverless request body size limit.
export async function POST(req: NextRequest) {
  const body = (await req.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const pw = process.env.ADMIN_PASSWORD;
        if (pw && clientPayload !== pw) throw new Error("Wrong password");
        return {
          allowedContentTypes: ["video/mp4", "video/webm", "video/quicktime"],
          maximumSizeInBytes: 300 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return Response.json(json);
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : String(e) }, { status: 400 });
  }
}
