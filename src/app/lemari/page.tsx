"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function WardrobeRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/profile?tab=wardrobe");
  }, [router]);

  return (
    <div className="min-h-screen bg-[var(--ds-sand)] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-8 h-8 border-2 border-charcoal-900 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="font-serif text-lg text-charcoal-900 mb-2">Membuka Lemari OOTD di Profil...</p>
      <Link
        href="/profile?tab=wardrobe"
        className="text-xs font-bold uppercase tracking-widest text-terracotta-600 underline"
      >
        Klik di sini jika tidak beralih otomatis
      </Link>
    </div>
  );
}
