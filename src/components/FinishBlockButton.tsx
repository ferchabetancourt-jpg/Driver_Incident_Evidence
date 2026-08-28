"use client";

import { useTransition } from "react";
import { useLanguage } from "@/lib/i18n/context";

export function FinishBlockButton({
  onFinish,
  className,
}: {
  onFinish: () => Promise<void>;
  className?: string;
}) {
  const { t } = useLanguage();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(t.blocks.finishConfirm)) {
          startTransition(() => {
            onFinish();
          });
        }
      }}
      className={
        className ??
        "rounded-md bg-navy px-3 py-2 text-sm font-medium text-white hover:bg-navy-light disabled:opacity-50"
      }
    >
      {t.blocks.finish}
    </button>
  );
}
