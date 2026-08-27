"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { createClient } from "@/lib/supabase/client";
import { LanguageToggle } from "./LanguageToggle";
import {
  HomeIcon,
  LogoutIcon,
  SearchIcon,
  StationIcon,
  BlockIcon,
} from "./icons";

export function Nav() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const menuItems = [
    { href: "/dashboard", label: t.nav.dashboard, subtitle: t.dashboard.title, Icon: HomeIcon },
    { href: "/stations", label: t.nav.stations, subtitle: t.stations.title, Icon: StationIcon },
    { href: "/blocks", label: t.nav.blocks, subtitle: t.blocks.title, Icon: BlockIcon },
    { href: "/search", label: t.nav.search, subtitle: t.search.title, Icon: SearchIcon },
  ];

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between bg-navy px-3 text-white shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-navy-light/50"
          >
            <span className="text-2xl leading-none">☰</span>
          </button>
          <Image src="/logo-transparent.png" alt="" width={32} height={32} className="h-8 w-8" />
          <span className="font-display text-sm font-semibold">{t.appName}</span>
        </div>
        <LanguageToggle />
      </header>

      {menuOpen && (
        <div className="fixed inset-0 top-16 z-30 bg-black/30" onClick={() => setMenuOpen(false)}>
          <nav
            className="mx-auto max-w-3xl space-y-2 bg-background p-3"
            onClick={(e) => e.stopPropagation()}
          >
            {menuItems.map(({ href, label, subtitle, Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-xl bg-surface p-4 shadow-sm"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-navy">
                  <Icon />
                </span>
                <span className="flex-1">
                  <span className="block font-semibold text-navy">{label}</span>
                  <span className="block text-sm text-slate">{subtitle}</span>
                </span>
                <span className="text-brand-500">›</span>
              </Link>
            ))}
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-xl bg-surface p-4 text-left shadow-sm"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-navy">
                <LogoutIcon />
              </span>
              <span className="flex-1">
                <span className="block font-semibold text-navy">{t.nav.logout}</span>
              </span>
            </button>
          </nav>
        </div>
      )}
    </>
  );
}
