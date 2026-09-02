"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { RefreshCw, AlertTriangle, ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App boundary error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-charcoal-900 flex flex-col justify-between p-6 sm:p-10">
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="font-serif italic font-bold text-2xl text-[#181A18] flex items-baseline">
          look<span className="text-terracotta-500 not-italic">.</span>u
        </div>
        <span className="font-mono text-[10px] uppercase font-bold text-sand-500 tracking-wider">
          SYSTEM RECOVERY
        </span>
      </header>

      <main className="max-w-xl mx-auto text-center space-y-6 py-12">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto shadow-tactile">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="font-mono text-xs font-bold text-rose-600 uppercase tracking-widest">
            TERJADI KENDALA SISTEM
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#181A18] tracking-tight">
            Sesi Kurasi Terhenti Sejenak
          </h1>
          <p className="text-xs sm:text-sm text-sand-500 leading-relaxed max-w-md mx-auto">
            Koneksi peramban atau sinkronisasi AI mengalami kendala sesaat. Tenang, data lemari lokal kamu tetap aman di perangkat.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Ulangi Sesi</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white hover:bg-sand-100 border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </main>

      <footer className="text-center font-mono text-xs text-sand-500 max-w-5xl mx-auto w-full">
        LOOK.U AI ENGINE • SELF-HEALING ARCHITECTURE
      </footer>
    </div>
  );
}
