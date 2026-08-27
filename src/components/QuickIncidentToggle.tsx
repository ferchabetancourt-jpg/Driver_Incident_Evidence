"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { QuickIncidentForm } from "./QuickIncidentForm";

export function QuickIncidentToggle({ blockId }: { blockId: string }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-4 text-base font-semibold text-white shadow-sm hover:bg-brand-700"
      >
        🎙 {t.incident.quickCapture}
      </button>
    );
  }

  return (
    <QuickIncidentForm
      blockId={blockId}
      onCancel={() => setOpen(false)}
      onSaved={() => setOpen(false)}
    />
  );
}
