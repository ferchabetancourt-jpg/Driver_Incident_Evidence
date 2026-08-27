"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { LanguageToggle } from "./LanguageToggle";

export function Nav() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/dashboard", label: t.nav.dashboard },
    { href: "/stations", label: t.nav.stations },
    { href: "/blocks", label: t.nav.blocks },
    { href: "/search", label: t.nav.search },
  ];

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <span className="font-semibold text-brand-700">{t.appName}</span>
        <nav className="flex items-center gap-4 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname?.startsWith(link.href)
                  ? "font-medium text-brand-700"
                  : "text-gray-600 hover:text-brand-700"
              }
            >
              {link.label}
            </Link>
          ))}
          <LanguageToggle />
          <button onClick={logout} className="text-gray-600 hover:text-red-600">
            {t.nav.logout}
          </button>
        </nav>
      </div>
    </header>
  );
}
