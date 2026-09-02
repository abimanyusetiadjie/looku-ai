import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Camera, Database, EyeOff, Lock, RefreshCw } from "lucide-react";

export const metadata = {
  title: "Kebijakan Privasi • look.u AI",
  description: "Kebijakan privasi dan perlindungan data pengguna look.u AI Studio OOTD.",
};

export default function PrivacyPolicyPage() {
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
              Legal
            </span>
          </div>

          <Link
            href="/terms"
            className="text-xs font-bold text-terracotta-600 hover:text-charcoal-900 transition-colors uppercase tracking-wider"
          >
            Syarat & Ketentuan →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        {/* Title Badge */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-terracotta-500" />
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-terracotta-600">
              PRIVACY & DATA PROTECTION POLICY
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#181A18] tracking-tight">
            Kebijakan Privasi look.u
          </h1>
          <p className="text-xs font-mono text-sand-500">
            Terakhir diperbarui: 2 September 2026 • Berlaku efektif untuk seluruh pengguna platform look.u AI.
          </p>
        </div>

        {/* Highlight Callout */}
        <div className="p-6 rounded-3xl bg-white border border-[#E8DFD1] shadow-tactile space-y-3">
          <div className="flex items-center gap-2.5 text-xs font-bold text-charcoal-900">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Prinsip Dasar Privasi: Zero-Server Facial Storage</span>
          </div>
          <p className="text-xs sm:text-sm text-sand-500 leading-relaxed">
            look.u AI dirancang dengan prinsip <strong>Local-First & Client-Side Privacy</strong>. Kami tidak pernah
            menyimpan foto selfie, wajah, maupun pakaian Anda ke database publik permanen. Seluruh analisis warna kulit
            (Personal Color) diproses langsung pada memori peramban (browser RAM) perangkat Anda dan segera dibuang seketika.
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-charcoal-900/80 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal-900 flex items-center gap-2">
              <Camera className="w-4 h-4 text-terracotta-500" />
              <span>1. Pemrosesan Data Kamera & Foto AI</span>
            </h2>
            <p>
              Saat Anda menggunakan fitur <strong>Kamera & Scan Foto AI</strong> untuk mendeteksi warna kulit (*skin tone*)
              atau memadukan pakaian yang Anda miliki (*Wardrobe Mixer*):
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sand-600">
              <li>Akses kamera hanya aktif selama jendela pemindaian dibuka dengan izin eksplisit dari pengguna.</li>
              <li>Ekstraksi palet warna kulit dijalankan secara instan di peramban menggunakan Canvas API.</li>
              <li>Foto mentah (*raw image*) tidak diunggah ke server cloud publik dan tidak digunakan untuk melatih model AI publik tanpa persetujuan tertulis.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-terracotta-500" />
              <span>2. Penyimpanan Lemari & Riwayat Lokal (LocalStorage)</span>
            </h2>
            <p>
              Untuk memberikan pengalaman personalisasi tanpa mewajibkan pendaftaran akun yang rumit pada tahap awal, kami menyimpan preferensi busana Anda secara lokal di peramban:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sand-600">
              <li><strong>Formula OOTD Tersimpan:</strong> Disimpan di kunci <code>looku_saved_outfits</code> perangkat Anda.</li>
              <li><strong>Riwayat Kurasi AI:</strong> Dibatasi maksimal 30 riwayat pada <code>looku_generation_history</code>.</li>
              <li><strong>Hasil Kuis Personal Color:</strong> Disimpan di <code>looku_personal_color</code> untuk menyelaraskan feed Lookbook.</li>
            </ul>
            <p className="text-[11px] text-sand-500 italic">
              Anda dapat mengunduh salinan cadangan (*Export JSON*) atau menghapus seluruh data lokal kapan saja melalui halaman <strong>Profil → Pengaturan Data</strong>.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal-900 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-terracotta-500" />
              <span>3. Tautan Afiliasi & Transaksi Pihak Ketiga</span>
            </h2>
            <p>
              Platform look.u menyertakan tautan rekomendasi belanja ke marketplace pihak ketiga resmi (seperti Shopee dan Tokopedia) dengan parameter pelacakan afiliasi terverifikasi (misal: <code>af_id=looku_ootd</code>).
            </p>
            <p>
              look.u <strong>tidak memproses pembayaran kartu kredit, rekening bank, maupun data transaksi pembelian</strong>. Seluruh proses transaksi, pengiriman produk, dan pengembalian barang tunduk sepenuhnya pada kebijakan privasi dan ketentuan layanan marketplace terkait.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal-900 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-terracotta-500" />
              <span>4. Hak Pengguna & Penghapusan Data</span>
            </h2>
            <p>
              Setiap pengguna berhak untuk:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sand-600">
              <li>Menghentikan akses kamera sewaktu-waktu melalui pengaturan peramban.</li>
              <li>Mengosongkan seluruh data cache dan lemari tersimpan secara mandiri dalam 1-klik.</li>
              <li>Menghubungi tim editorial kami untuk pertanyaan terkait privasi melalui <code>privacy@looku.ai</code>.</li>
            </ul>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="pt-8 border-t border-[#E8DFD1] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-sand-500">
          <div>LOOK.U AI ATELIER • JAKARTA, INDONESIA</div>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-charcoal-900 transition-colors underline">
              Syarat & Ketentuan
            </Link>
            <Link href="/about" className="hover:text-charcoal-900 transition-colors underline">
              Tentang Kami
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
