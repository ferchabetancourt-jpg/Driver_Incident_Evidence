"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import {
  formatDateTime12h,
  formatPayAmount,
  formatStationLabel,
  formatTime12h,
  isBlockOpen,
  type Block,
  type Station,
} from "@/lib/types";
import { FinishBlockButton } from "@/components/FinishBlockButton";
import { closeBlock, updateBlock } from "../actions";

export function BlockHeader({ block, stations }: { block: Block; stations: Station[] }) {
  const { t, lang } = useLanguage();
  const [editing, setEditing] = useState(false);
  const open = isBlockOpen(block);

  if (editing) {
    return (
      <form
        action={async (formData) => {
          await updateBlock(block.id, formData);
          setEditing(false);
        }}
        className="space-y-3 rounded-lg border border-gray-200 bg-white p-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-700">{t.blocks.new}</h2>
          <button type="button" onClick={() => setEditing(false)} className="text-sm text-slate">
            {t.common.cancel}
          </button>
        </div>

        <label className="block text-sm text-gray-600">{t.blocks.station}</label>
        <select
          name="station_id"
          defaultValue={block.station_id}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        >
          {stations.map((station) => (
            <option key={station.id} value={station.id}>
              {formatStationLabel(station)}
            </option>
          ))}
        </select>

        <label className="block text-sm text-gray-600">{t.blocks.date}</label>
        <input
          type="date"
          name="block_date"
          defaultValue={block.block_date}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />

        <label className="block text-sm text-gray-600">{t.blocks.startTime}</label>
        <input
          type="time"
          name="start_time"
          defaultValue={block.start_time.slice(0, 5)}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />

        <label className="block text-sm text-gray-600">{t.blocks.endTime}</label>
        <input
          type="time"
          name="end_time"
          defaultValue={block.end_time?.slice(0, 5) ?? ""}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />

        <label className="block text-sm text-gray-600">{t.blocks.payAmount}</label>
        <input
          type="number"
          name="pay_amount"
          min="0"
          step="0.01"
          inputMode="decimal"
          defaultValue={block.pay_amount ?? ""}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />

        <button
          type="submit"
          className="w-full rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700"
        >
          {t.blocks.save}
        </button>
      </form>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <Link href="/blocks" className="text-sm text-brand-600 hover:underline">
            ← {formatStationLabel(block.stations)}
          </Link>
          <h1 className="text-xl font-semibold">
            {block.block_date} · {formatTime12h(block.start_time)}
            {block.end_time && <> – {formatTime12h(block.end_time)}</>}
            {formatPayAmount(block.pay_amount) && (
              <span className="ml-2 text-success">{formatPayAmount(block.pay_amount)}</span>
            )}
          </h1>
          <p className="text-sm text-slate">
            {open ? t.blocks.open : t.blocks.closed}
            {!open && block.closed_at && (
              <> · {t.blocks.closedAt} {formatDateTime12h(block.closed_at, lang)}</>
            )}
          </p>
        </div>
        <button
          type="button"
          aria-label={t.common.edit}
          onClick={() => setEditing(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-2xl text-slate hover:bg-gray-100"
        >
          ✎
        </button>
      </div>
      {open && <FinishBlockButton onFinish={() => closeBlock(block.id)} />}
    </div>
  );
}
