"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { CATEGORY_LABELS } from "@/lib/i18n/dictionary";
import { formatDateTime12h, formatStationLabel, formatTime12h, type Incident } from "@/lib/types";

export function IncidentList({ incidents }: { incidents: Incident[] }) {
  const { t, lang } = useLanguage();

  if (incidents.length === 0) {
    return <p className="text-sm text-gray-500">{t.dashboard.noIncidents}</p>;
  }

  const groups: { key: string; block: Incident["blocks"]; items: Incident[] }[] = [];
  const groupIndexByKey = new Map<string, number>();
  for (const incident of incidents) {
    const key = incident.block_id;
    let index = groupIndexByKey.get(key);
    if (index === undefined) {
      index = groups.length;
      groupIndexByKey.set(key, index);
      groups.push({ key, block: incident.blocks, items: [] });
    }
    groups[index].items.push(incident);
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.key}>
          {group.block && (
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate">
              {group.block.block_date} · {formatTime12h(group.block.start_time)} ·{" "}
              {formatStationLabel(group.block.stations)}
            </p>
          )}
          <ul className="space-y-2">
            {group.items.map((incident) => {
              const tbas = (incident.incident_packages ?? [])
                .map((ip) => ip.packages?.tba)
                .filter(Boolean);
              const hasAudio = (incident.evidence ?? []).some((e) => e.type === "audio");
              const hasPhoto = (incident.evidence ?? []).some((e) => e.type === "photo");

              return (
                <li key={incident.id} className="rounded-lg border border-gray-200 bg-white p-4">
                  <Link href={`/incidents/${incident.id}`} className="block">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {CATEGORY_LABELS[incident.category]?.[lang] ?? incident.category}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatDateTime12h(incident.occurred_at, lang)}
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
        </div>
      ))}
    </div>
  );
}
