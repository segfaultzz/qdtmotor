"use client";

import Image from "next/image";
import { LuMaximize2 } from "react-icons/lu";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useT } from "./LanguageProvider";

export default function WeChatCard() {
  const t = useT();
  return (
    <Card className="h-full justify-center border border-white/10 bg-neutral-950/60 p-6 ring-0">
      <CardContent className="flex items-center justify-center p-0">
        <Dialog>
          <DialogTrigger
            render={
              <button
                type="button"
                className="group relative block w-full max-w-sm overflow-hidden rounded-xl bg-white p-4 shadow-xl shadow-black/40 transition hover:scale-[1.02]"
                aria-label={t("wechat.enlarge")}
              />
            }
          >
            <Image src="/wechat-qr.png" alt={t("wechat.dialogTitle")} width={652} height={650} className="h-auto w-full" />
            <span className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition group-hover:opacity-100">
              <span className="flex items-center gap-2 text-sm font-medium text-white">
                <LuMaximize2 /> {t("wechat.enlarge")}
              </span>
            </span>
          </DialogTrigger>
          <DialogContent className="max-w-md sm:max-w-md">
            <DialogTitle className="sr-only">{t("wechat.dialogTitle")}</DialogTitle>
            <DialogDescription className="sr-only">{t("wechat.dialogDesc")}</DialogDescription>
            <div className="rounded-lg bg-white p-3">
              <Image src="/wechat-qr.png" alt={t("wechat.dialogTitle")} width={652} height={650} className="mx-auto h-auto w-full" />
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
