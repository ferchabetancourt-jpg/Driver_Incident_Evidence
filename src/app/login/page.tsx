"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/lib/i18n/context";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message === "Email not confirmed" ? t.auth.emailNotConfirmed : t.auth.error);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-10">
      <div className="mb-6 flex flex-col items-center">
        <Image src="/logo-transparent.png" alt="" width={72} height={72} className="h-16 w-16" />
        <span className="mt-2 font-display text-lg font-semibold text-navy">{t.appName}</span>
      </div>
      <h1 className="mb-6 text-center text-xl font-semibold">{t.auth.loginTitle}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">{t.auth.email}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">{t.auth.password}</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-brand-600 px-4 py-2 text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {t.auth.loginButton}
        </button>
      </form>
      <Link href="/signup" className="mt-4 block text-center text-sm text-brand-600">
        {t.auth.noAccount}
      </Link>
      <p className="mt-10 text-center text-xs text-slate/70">
        © {new Date().getFullYear()} María Fernanda Betancourt
      </p>
    </div>
  );
}
