"use client";

import { useLanguage } from "@/lib/i18n/context";
import type { Station } from "@/lib/types";
import { createStation, toggleStationActive } from "./actions";

export function StationsClient({ stations }: { stations: Station[] }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">{t.stations.title}</h1>

      <form
        action={async (formData) => {
          await createStation(formData);
        }}
        className="space-y-3 rounded-lg border border-gray-200 bg-white p-4"
      >
        <h2 className="text-sm font-medium text-gray-700">{t.stations.new}</h2>
        <input
          name="name"
          required
          placeholder={t.stations.name}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
        <input
          name="station_code"
          placeholder={t.stations.code}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
        <input
          name="address"
          placeholder={t.stations.address}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        />
        <button
          type="submit"
          className="rounded-md bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700"
        >
          {t.stations.save}
        </button>
      </form>

      <ul className="space-y-2">
        {stations.length === 0 && <p className="text-sm text-gray-500">{t.stations.none}</p>}
        {stations.map((station) => (
          <li
            key={station.id}
            className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
          >
            <div>
              <p className="font-medium">{station.name}</p>
              <p className="text-sm text-gray-500">
                {station.station_code} {station.address ? `· ${station.address}` : ""}
              </p>
            </div>
            <form
              action={async () => {
                await toggleStationActive(station.id, !station.active);
              }}
            >
              <button
                type="submit"
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  station.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                }`}
              >
                {station.active ? t.stations.active : t.stations.inactive}
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
