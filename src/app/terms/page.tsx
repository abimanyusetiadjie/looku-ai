import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Scale, ShoppingCart, Sparkles, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Syarat & Ketentuan • look.u AI",
  description: "Syarat dan ketentuan penggunaan platform kurasi busana look.u AI.",
};

export default function TermsPage() {
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
            href="/privacy"
            className="text-xs font-bold text-terracotta-600 hover:text-charcoal-900 transition-colors uppercase tracking-wider"
          >
            Kebijakan Privasi →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        {/* Title Badge */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-terracotta-500" />
            <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-terracotta-600">
              TERMS OF SERVICE & USER AGREEMENT
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#181A18] tracking-tight">
            Syarat & Ketentuan Layanan
          </h1>
          <p className="text-xs font-mono text-sand-500">
            Terakhir diperbarui: 2 September 2026 • Berlaku untuk seluruh pengunjung & pengguna layanan look.u AI.
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 text-xs sm:text-sm text-charcoal-900/80 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-terracotta-500" />
              <span>1. Deskripsi & Sifat Layanan AI</span>
            </h2>
            <p>
              look.u adalah platform kurasi gaya busana (*fashion styling assistant*) berbasis kecerdasan buatan (AI)
              yang memberikan inspirasi perpaduan pakaian, analisis *personal color*, dan rekomendasi bahan yang
              dioptimalkan untuk iklim tropis Indonesia.
            </p>
            <p>
              Rekomendasi yang dihasilkan merupakan saran estetika gaya busana dan tidak menjamin ketersediaan stok,
              kesesuaian ukuran mutlak, atau fluktuasi harga pada toko pihak ketiga.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal-900 flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-terracotta-500" />
              <span>2. Keterbukaan Program Afiliasi (Affiliate Disclosure)</span>
            </h2>
            <p>
              look.u berpartisipasi dalam program afiliasi marketplace resmi (termasuk Shopee Affiliate Program dan
              Tokopedia Affiliate). Tautan belanja yang disediakan dapat memuat tag pelacakan afiliasi
              (seperti <code>af_id=looku_ootd</code>).
            </p>
            <p>
              Saat Anda mengklik tautan tersebut dan melakukan pembelian, look.u dapat menerima komisi rujukan kecil
              <strong>tanpa membebankan biaya tambahan apa pun kepada Anda</strong>. Hal ini membantu kami menjaga layanan
              dasar look.u tetap gratis dan bebas biaya bagi komunitas.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-terracotta-500" />
              <span>3. Hak Kekayaan Intelektual</span>
            </h2>
            <p>
              Seluruh elemen desain antarmuka, logo look.u, tipografi Atelier, skrip kurasi, dan algoritma heuristik OOTD
              adalah hak milik intelektual look.u AI.
            </p>
            <p>
              Pengguna diberikan hak penuh untuk membagikan (*share*), mengunduh (*export*), dan mempublikasikan kartu
              Instagram Story 9:16 hasil kurasi personal mereka ke media sosial untuk keperluan non-komersial.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-serif font-bold text-lg sm:text-xl text-charcoal-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-terracotta-500" />
              <span>4. Batasan Tanggung Jawab</span>
            </h2>
            <p>
              look.u tidak bertanggung jawab atas:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sand-600">
              <li>Keterlambatan pengiriman, kerusakan fisik produk, atau perselisihan transaksi antara pengguna dengan penjual di Shopee/Tokopedia.</li>
              <li>Perbedaan minor warna fisik kain akibat kalibrasi layar monitor atau pencahayaan foto produk penjual.</li>
              <li>Kehilangan data riwayat lokal jika pengguna menghapus cache peramban secara manual tanpa mengekspor cadangan JSON.</li>
            </ul>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="pt-8 border-t border-[#E8DFD1] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-sand-500">
          <div>LOOK.U AI ATELIER • JAKARTA, INDONESIA</div>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-charcoal-900 transition-colors underline">
              Kebijakan Privasi
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
