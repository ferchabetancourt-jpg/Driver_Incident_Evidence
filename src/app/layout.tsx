import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { createClient } from "@/lib/supabase/server";
import { LanguageProvider } from "@/lib/i18n/context";
import { Nav } from "@/components/Nav";
import { ScrollResetOnNavigate } from "@/components/ScrollResetOnNavigate";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

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
    <html lang={initialLang} className={`${inter.variable} ${manrope.variable}`}>
      <body className="flex min-h-dvh flex-col bg-background font-sans">
        <LanguageProvider initialLang={initialLang}>
          <ScrollResetOnNavigate />
          <Nav />
          <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-6 pt-20">{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
