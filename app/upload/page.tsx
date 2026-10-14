import type { Metadata } from "next";
import Link from "next/link";
import VideoUploader from "@/components/VideoUploader";
import Gallery from "@/components/Gallery";

export const metadata: Metadata = {
  title: "Upload Photos | QDT Motor",
  robots: { index: false, follow: false },
};

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-sm text-white/50 hover:text-white">← Back to website</Link>
        <h1 className="mb-2 mt-6 text-4xl font-black">Manage vehicle photos</h1>
        <p className="mb-10 text-white/60">Upload new photos or click a photo and choose Delete. Changes appear on the website gallery.</p>
        <VideoUploader />
        <h2 className="mb-4 text-xl font-bold">Vehicle photos</h2>
        <Gallery admin />
      </div>
    </main>
  );
}
