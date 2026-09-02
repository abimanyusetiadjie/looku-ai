import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Sun, Compass, Heart, Award, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Tentang Kami • look.u AI Atelier",
  description: "Manifesto, filosofi kurasi gaya tropis 33°C, dan tim di balik look.u AI.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-charcoal-900 pb-20">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8DFD1]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal-900/70 hover:text-charcoal-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="font-serif italic font-bold text-xl text-[#181A18] flex items-baseline">
            look<span className="text-terracotta-500 not-italic">.</span>u
            <span className="font-mono text-[9px] not-italic ml-1.5 uppercase font-bold text-sand-500 tracking-wider">
              About
            </span>
          </div>

          <Link
            href="/studio"
            className="py-2 px-3.5 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mulai Racik ↗</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">
        {/* Hero Manifesto */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-terracotta-500" />
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-terracotta-600">
              OUR ATELIER MANIFESTO
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-[#181A18] tracking-tight leading-tight">
            Gaya yang Bernapas di Bawah Matahari Tropis.
          </h1>
          <p className="text-sm sm:text-base text-sand-500 max-w-2xl leading-relaxed">
            look.u lahir dari keresahan sederhana: mayoritas algoritma fashion global dirancang untuk iklim 4 musim di belahan bumi utara. Kami merancang AI stylist pertama yang memahami realitas iklim 33°C, kehangatan warna kulit Nusantara, dan elegansi busana modest harian.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-white border border-[#E8DFD1] shadow-tactile space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-charcoal-900">
              Uji Iklim 33°C Adem
            </h3>
            <p className="text-xs text-sand-500 leading-relaxed">
              Kami memprioritaskan material dengan sirkulasi udara optimal: Katun Rayon Twill, Linen Euro Crinkle, Tencel Modal, dan Voal Miracle yang tidak bikin gerah.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E8DFD1] shadow-tactile space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-terracotta-500/10 text-terracotta-600 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-charcoal-900">
              Personal Color Nusantara
            </h3>
            <p className="text-xs text-sand-500 leading-relaxed">
              Memahami harmoni undertone untuk 5 spektrum warna kulit Indonesia (Putih Gading, Kuning Langsat, Sawo Matang, Eksotis, dan Deep Bronze) agar wajah tampak bersinar.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-[#E8DFD1] shadow-tactile space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-lg text-charcoal-900">
              Modest & Realistic
            </h3>
            <p className="text-xs text-sand-500 leading-relaxed">
              Menghormati kesantunan busana hijab yang flowy tanpa kompromi pada estetika kontemporer, dengan tautan toko terkurasi harga mahasiswa hingga official mall.
            </p>
          </div>
        </div>

        {/* Curation Standard */}
        <div className="p-8 rounded-3xl bg-charcoal-900 text-sand-50 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-terracotta-300">
              CURATION STANDARDS
            </span>
          </div>

          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            Standar Kurasi 0% Asal Rekomendasi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#D7CABC]">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="font-bold text-white uppercase font-mono">Toko Bintang 4.8+</div>
              <p>Hanya menyertakan link toko marketplace dengan reputasi bintang minimal 4.8 dan ulasan pembeli terverifikasi.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <div className="font-bold text-white uppercase font-mono">Harga Realistis</div>
              <p>Estimasi bujet dihitung berdasarkan harga riil pasar pakaian lokal Indonesia, bukan kurs luar negeri yang tidak masuk akal.</p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
            <div className="text-xs text-sand-300 font-mono">
              look.u Studio • Berbasis di Jakarta Selatan
            </div>
            <Link
              href="/#studio"
              className="py-3 px-6 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <span>Coba Studio OOTD</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="pt-8 border-t border-[#E8DFD1] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-sand-500">
          <div>LOOK.U AI ATELIER • ALL RIGHTS RESERVED</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-charcoal-900 transition-colors underline">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="hover:text-charcoal-900 transition-colors underline">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
