"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { CATEGORY_LABELS } from "@/lib/i18n/dictionary";
import type { Incident } from "@/lib/types";

export function IncidentList({ incidents }: { incidents: Incident[] }) {
  const { t, lang } = useLanguage();

  if (incidents.length === 0) {
    return <p className="text-sm text-gray-500">{t.dashboard.noIncidents}</p>;
  }

  return (
    <ul className="space-y-2">
      {incidents.map((incident) => {
        const tbas = (incident.incident_packages ?? [])
          .map((ip) => ip.packages?.tba)
          .filter(Boolean);
        const hasAudio = (incident.evidence ?? []).some((e) => e.type === "audio");
        const hasPhoto = (incident.evidence ?? []).some((e) => e.type === "photo");

        return (
          <li key={incident.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <Link href={`/incidents/${incident.id}`} className="block">
              <div className="flex items-center justify-between">
                <p className="font-medium">{CATEGORY_LABELS[incident.category]?.[lang] ?? incident.category}</p>
                <span className="text-xs text-gray-500">
                  {new Date(incident.occurred_at).toLocaleString(lang === "es" ? "es-ES" : "en-US")}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                {tbas.length > 0 ? tbas.join(", ") : t.incident.noLinkedPackages}
              </p>
              <div className="mt-1 flex gap-2 text-xs text-gray-400">
                {hasAudio && <span>🎙</span>}
                {hasPhoto && <span>📷</span>}
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
