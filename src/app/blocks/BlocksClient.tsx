"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/context";
import { formatPayAmount, formatStationLabel, formatTime12h, isBlockOpen, type Block, type Station } from "@/lib/types";
import { DeleteBlockButton } from "@/components/DeleteBlockButton";
import { createBlock, deleteBlock } from "./actions";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export function BlocksClient({ blocks, stations }: { blocks: Block[]; stations: Station[] }) {
  const { t, lang } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">{t.blocks.title}</h1>

      <form
        action={async (formData) => {
          await createBlock(formData);
        }}
        className="space-y-3 rounded-lg border border-gray-200 bg-white p-4"
      >
        <h2 className="text-sm font-medium text-gray-700">{t.blocks.new}</h2>

        <label className="block text-sm text-gray-600">{t.blocks.station}</label>
        <select name="station_id" required className="w-full rounded-md border border-gray-300 px-3 py-2">
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
          required
          defaultValue={todayIso()}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />

        <label className="block text-sm text-gray-600">{t.blocks.startTime}</label>
        <input
          type="time"
          name="start_time"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />

        <label className="block text-sm text-gray-600">{t.blocks.endTime}</label>
        <input type="time" name="end_time" className="w-full rounded-md border border-gray-300 px-3 py-2" />

        <label className="block text-sm text-gray-600">{t.blocks.payAmount}</label>
        <input
          type="number"
          name="pay_amount"
          min="0"
          step="0.01"
          inputMode="decimal"
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />

        <button
          type="submit"
          disabled={stations.length === 0}
          className="rounded-md bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {t.blocks.save}
        </button>
        {stations.length === 0 && (
          <p className="text-xs text-amber-700">
            {lang === "es"
              ? "Crea una estación antes de registrar un bloque."
              : "Create a station before logging a block."}
          </p>
        )}
      </form>

      <ul className="space-y-2">
        {blocks.length === 0 && <p className="text-sm text-gray-500">{t.blocks.none}</p>}
        {blocks.map((block) => (
          <li
            key={block.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
          >
            <div>
              <p className="font-medium">
                {block.block_date} · {formatTime12h(block.start_time)}
                {formatPayAmount(block.pay_amount) && (
                  <span className="ml-2 text-success">{formatPayAmount(block.pay_amount)}</span>
                )}
              </p>
              <p className="text-sm text-gray-500">{formatStationLabel(block.stations)}</p>
              <span
                className={`inline-block rounded-full px-2 py-0.5 text-xs ${
                  isBlockOpen(block) ? "bg-brand-50 text-brand-700" : "bg-gray-100 text-slate"
                }`}
              >
                {isBlockOpen(block) ? t.blocks.open : t.blocks.closed}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Link href={`/blocks/${block.id}`} className="text-sm text-brand-600 hover:underline">
                {t.blocks.viewDetail}
              </Link>
              <DeleteBlockButton onDelete={() => deleteBlock(block.id)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
