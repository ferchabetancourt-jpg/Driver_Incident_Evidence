"use client";

import { useTransition } from "react";
import { useLanguage } from "@/lib/i18n/context";

export function DeleteBlockButton({
  onDelete,
  className,
}: {
  onDelete: () => Promise<void>;
  className?: string;
}) {
  const { t } = useLanguage();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-label={t.blocks.delete}
      title={t.blocks.delete}
      disabled={pending}
      onClick={() => {
        if (window.confirm(t.blocks.deleteConfirm)) {
          startTransition(() => {
            onDelete();
          });
        }
      }}
      className={
        className ??
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-danger hover:bg-danger/10 disabled:opacity-50"
      }
    >
      ✕
    </button>
  );
}
