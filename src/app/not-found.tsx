"use client";

import React from "react";
import Link from "next/link";
import { Compass, Sparkles, ArrowRight } from "lucide-react";

export default function NotFound() {
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
      <main className="max-w-xl mx-auto text-center space-y-6 py-12">
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

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/#studio"
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Buka Studio OOTD</span>
          </Link>
          <Link
            href="/#trending"
            className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white hover:bg-sand-100 border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Eksplor Lookbook Trending</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center font-mono text-xs text-sand-500 max-w-5xl mx-auto w-full">
        © {new Date().getFullYear()} LOOK.U AI • CURATED FOR TROPICAL CONFIDENCE
      </footer>
    </div>
  );
}
