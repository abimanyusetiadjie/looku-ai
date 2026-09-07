"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Compass, Sparkles, ArrowRight, Home, Palette, BookOpen, Bookmark } from "lucide-react";

export default function NotFound() {
  // Telemetri otomatis pencatat rute rusak
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        fetch("/api/telemetry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "404_broken_link",
            url: window.location.href,
            metadata: {
              path: window.location.pathname,
              search: window.location.search,
              referrer: document.referrer || "direct",
            },
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {});
      } catch {
        // Abaikan error telemetri di background
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-charcoal-900 flex flex-col justify-between p-6 sm:p-10">
      {/* Header */}
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full">
        <Link href="/" className="font-serif italic font-bold text-2xl text-[#181A18] flex items-baseline">
          look<span className="text-terracotta-500 not-italic">.</span>u
        </Link>
        <span className="font-mono text-[10px] uppercase font-bold text-sand-500 tracking-wider">
          ERROR 404 • ATELIER RESILIENCE
        </span>
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto text-center space-y-6 py-10 sm:py-14">
        <div className="w-16 h-16 rounded-3xl bg-terracotta-500/10 text-terracotta-600 flex items-center justify-center mx-auto shadow-tactile">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="font-mono text-xs font-bold text-terracotta-600 uppercase tracking-widest">
            HALAMAN TIDAK DITEMUKAN
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#181A18] tracking-tight">
            Formula Gaya Ini Sedang Dikurasi Ulang
          </h1>
          <p className="text-xs sm:text-sm text-sand-500 leading-relaxed max-w-md mx-auto">
            Halaman atau look OOTD yang kamu cari mungkin telah dipindahkan atau tautan belum terdaftar di atelier kami.
          </p>
        </div>

        {/* 1. Primary Action: Kembali ke Beranda Utama */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto py-3.5 px-7 rounded-2xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda Utama</span>
          </Link>
          <Link
            href="/studio"
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white hover:bg-sand-100 border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
            <span>Buka Studio OOTD</span>
          </Link>
        </div>

        {/* 2. Smart Shortcut Pills (Alternatif Populer) */}
        <div className="pt-4 border-t border-sand-200/80 space-y-2.5">
          <div className="text-[10px] font-mono uppercase font-bold text-sand-400 tracking-wider">
            ATAU EKSPLORASI FITUR POPULER:
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/studio?look=kuliah_hijab_panas_hemat"
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <span>☀️ OOTD 33°C Anti-Gerah</span>
            </Link>
            <Link
              href="/?openQuiz=true"
              className="px-3 py-2 rounded-xl bg-sage-50 hover:bg-sage-100 border border-sage-200 text-sage-900 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Palette className="w-3.5 h-3.5 text-sage-600" />
              <span>Tes Personal Color (60s)</span>
            </Link>
            <Link
              href="/lookbook"
              className="px-3 py-2 rounded-xl bg-white hover:bg-sand-100 border border-sand-300 text-charcoal-900 text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Jelajah Lookbook</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center font-mono text-xs text-sand-500 max-w-5xl mx-auto w-full">
        © {new Date().getFullYear()} LOOK.U AI • CURATED FOR TROPICAL CONFIDENCE
      </footer>
    </div>
  );
}
