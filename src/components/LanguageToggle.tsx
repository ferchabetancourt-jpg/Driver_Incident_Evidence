"use client";

import { useLanguage } from "@/lib/i18n/context";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <div className="inline-flex rounded-md border border-gray-300 text-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setLang("es")}
        className={`px-2 py-1 ${lang === "es" ? "bg-brand-600 text-white" : "bg-white text-gray-700"}`}
      >
        ES
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        className={`px-2 py-1 ${lang === "en" ? "bg-brand-600 text-white" : "bg-white text-gray-700"}`}
      >
        EN
      </button>
    </div>
  );
}
