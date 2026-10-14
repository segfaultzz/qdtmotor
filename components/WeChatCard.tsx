"use client";

import Image from "next/image";
import { useState } from "react";
import { FaWeixin } from "react-icons/fa";
import { LuCheck, LuCopy, LuMaximize2 } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useT } from "./LanguageProvider";

const IDS = ["jieshidianmo", "baozouxiaoyuangong"];

function CopyId({ id }: { id: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(id);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {}
      }}
      className="group flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition hover:border-red-500/50 hover:bg-white/[0.06]"
      aria-label={`Copy WeChat ID ${id}`}
    >
      <span dir="ltr" className="font-mono text-sm text-white">{id}</span>
      <span className="flex items-center gap-1.5 text-xs text-white/40 transition group-hover:text-red-400">
        {copied ? <LuCheck /> : <LuCopy />}
        {copied ? t("wechat.copied") : t("wechat.copy")}
      </span>
    </button>
  );
}

export default function WeChatCard() {
  const t = useT();
  return (
    <Card className="h-full border border-white/10 bg-neutral-950/60 text-white ring-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge className="gap-1.5 bg-green-600/15 text-green-400 hover:bg-green-600/15">
            <FaWeixin /> {t("wechat.badge")}
          </Badge>
          <span className="text-xs text-white/40">{t("wechat.scan")}</span>
        </div>
        <CardTitle className="mt-3 text-xl font-semibold">{t("wechat.title")}</CardTitle>
        <CardDescription className="text-white/55">
          {t("wechat.desc")}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Dialog>
          <DialogTrigger
            render={
              <button
                type="button"
                className="group relative mx-auto block w-full max-w-[260px] overflow-hidden rounded-xl bg-white p-3 shadow-xl shadow-black/40 transition hover:scale-[1.02]"
                aria-label={t("wechat.enlarge")}
              />
            }
          >
            <Image src="/wechat-qr.png" alt="WeChat QR code" width={888} height={1131} className="h-auto w-full" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition group-hover:opacity-100">
              <span className="flex items-center gap-2 text-sm font-medium text-white">
                <LuMaximize2 /> {t("wechat.enlarge")}
              </span>
            </span>
          </DialogTrigger>
          <DialogContent className="max-w-md sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("wechat.dialogTitle")}</DialogTitle>
              <DialogDescription>{t("wechat.dialogDesc")}</DialogDescription>
            </DialogHeader>
            <div className="max-h-[75vh] overflow-auto rounded-lg bg-white p-3">
              <Image src="/wechat-qr.png" alt="WeChat QR code" width={888} height={1131} className="mx-auto h-auto w-full" />
            </div>
          </DialogContent>
        </Dialog>

        <div>
          <Separator className="bg-white/10" />
          <p className="mb-3 mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">{t("wechat.ids")}</p>
          <div className="space-y-2">
            {IDS.map((id) => (
              <CopyId key={id} id={id} />
            ))}
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full border-white/15 bg-transparent text-white hover:bg-white/5"
          render={<a href="/wechat-qr.png" download="qdt-motor-wechat-qr.png" />}
        >
          {t("wechat.download")}
        </Button>
      </CardContent>
    </Card>
  );
}
