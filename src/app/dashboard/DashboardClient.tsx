"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { formatPayAmount, formatStationLabel, type Block, type Incident } from "@/lib/types";
import { IncidentList } from "@/components/IncidentList";

export function DashboardClient({
  activeBlock,
  recentIncidents,
}: {
  activeBlock: Block | null;
  recentIncidents: Incident[];
}) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">{t.dashboard.title}</h1>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-medium text-gray-700">{t.dashboard.activeBlock}</h2>
        {activeBlock ? (
          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="font-medium">
                {activeBlock.block_date} · {activeBlock.start_time}
                {formatPayAmount(activeBlock.pay_amount) && (
                  <span className="ml-2 text-success">{formatPayAmount(activeBlock.pay_amount)}</span>
                )}
              </p>
              <p className="text-sm text-gray-500">{formatStationLabel(activeBlock.stations)}</p>
            </div>
            <Link
              href={`/blocks/${activeBlock.id}`}
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              {t.dashboard.quickIncident}
            </Link>
          </div>
        ) : (
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-gray-500">{t.dashboard.noActiveBlock}</p>
            <Link
              href="/blocks"
              className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
            >
              {t.dashboard.newBlock}
            </Link>
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-2 text-sm font-medium text-gray-700">{t.dashboard.recentIncidents}</h2>
        <IncidentList incidents={recentIncidents} />
      </div>
    </div>
  );
}
