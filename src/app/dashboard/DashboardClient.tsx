"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import {
  formatPayAmount,
  formatStationLabel,
  formatTime12h,
  isBlockOpen,
  type Block,
  type Incident,
} from "@/lib/types";
import { IncidentList } from "@/components/IncidentList";
import { FinishBlockButton } from "@/components/FinishBlockButton";
import { closeBlock } from "../blocks/actions";

export function DashboardClient({
  recentBlocks,
  recentIncidents,
}: {
  recentBlocks: Block[];
  recentIncidents: Incident[];
}) {
  const { t } = useLanguage();
  const activeBlock = recentBlocks.find(isBlockOpen) ?? null;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">{t.dashboard.title}</h1>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="text-sm font-medium text-gray-700">{t.dashboard.activeBlock}</h2>
        {activeBlock ? (
          <div className="mt-2 space-y-3">
            <div>
              <p className="font-medium">
                {activeBlock.block_date} · {formatTime12h(activeBlock.start_time)}
                {activeBlock.end_time && <> – {formatTime12h(activeBlock.end_time)}</>}
                {formatPayAmount(activeBlock.pay_amount) && (
                  <span className="ml-2 text-success">{formatPayAmount(activeBlock.pay_amount)}</span>
                )}
              </p>
              <p className="text-sm text-gray-500">{formatStationLabel(activeBlock.stations)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/blocks/${activeBlock.id}`}
                className="rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
              >
                {t.dashboard.quickIncident}
              </Link>
              <FinishBlockButton onFinish={() => closeBlock(activeBlock.id)} />
            </div>
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
