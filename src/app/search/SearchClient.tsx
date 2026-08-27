"use client";

import { useLanguage } from "@/lib/i18n/context";
import { CATEGORY_LABELS } from "@/lib/i18n/dictionary";
import { INCIDENT_CATEGORIES } from "@/lib/types";
import type { Incident, Station } from "@/lib/types";
import { IncidentList } from "@/components/IncidentList";

export function SearchClient({
  stations,
  results,
  searched,
}: {
  stations: Station[];
  results: Incident[];
  searched: boolean;
}) {
  const { t, lang } = useLanguage();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">{t.search.title}</h1>

      <form method="get" className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <div>
          <label className="block text-sm text-gray-600">{t.search.date}</label>
          <input type="date" name="date" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">{t.search.station}</label>
          <select name="station_id" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2">
            <option value="">{t.search.any}</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600">{t.search.tba}</label>
          <input name="tba" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm text-gray-600">{t.search.category}</label>
          <select name="category" className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2">
            <option value="">{t.search.any}</option>
            {INCIDENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat][lang]}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="rounded-md bg-brand-600 px-4 py-2 text-sm text-white hover:bg-brand-700">
          {t.search.submit}
        </button>
      </form>

      {searched && (
        <div>
          <h2 className="mb-2 text-sm font-medium text-gray-700">{t.search.results}</h2>
          {results.length === 0 ? (
            <p className="text-sm text-gray-500">{t.search.none}</p>
          ) : (
            <IncidentList incidents={results} />
          )}
        </div>
      )}
    </div>
  );
}
