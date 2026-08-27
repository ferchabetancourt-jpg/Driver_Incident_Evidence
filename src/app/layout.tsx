import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { LanguageProvider } from "@/lib/i18n/context";
import { Nav } from "@/components/Nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "Driver Incident Evidence",
  description: "Bitácora de incidentes para conductores de reparto",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let initialLang: "es" | "en" = "es";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("language")
      .eq("id", user.id)
      .single();
    if (profile?.language === "en" || profile?.language === "es") {
      initialLang = profile.language;
    }
  }

  return (
    <html lang={initialLang}>
      <body>
        <LanguageProvider initialLang={initialLang}>
          <Nav />
          <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
