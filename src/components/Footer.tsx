"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setErrorMsg("Masukkan format email yang valid.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setEmail("");
      } else {
        setErrorMsg(data.error || "Gagal berlangganan.");
      }
    } catch {
      setErrorMsg("Koneksi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm w-full">
      <h4 className="text-sm font-bold text-white tracking-wide uppercase mb-2">
        Dapatkan Inspirasi Mingguan
      </h4>
      <p className="text-xs text-sand-500 leading-relaxed mb-3">
        Tips OOTD tropis, tren warna musiman, dan kurasi outfit langsung ke inbox kamu.
      </p>

      {success ? (
        <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Terima kasih! Kamu telah terdaftar di newsletter look.u ✨</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@kamu.com"
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-terracotta-500 transition-colors"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white text-xs font-bold tracking-wider uppercase transition-colors shadow-sm flex items-center justify-center min-w-[90px]"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>Langganan</span>}
            </button>
          </div>
          {errorMsg && (
            <p className="text-[11px] text-rose-400 font-mono">{errorMsg}</p>
          )}
        </form>
      )}
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-sand-50 py-14 border-t border-olive-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top: Logo + Nav + Social */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/10">
          <div>
            <div className="font-serif italic font-bold text-3xl tracking-tight text-white flex items-baseline">
              look<span className="text-terracotta-500 not-italic">.</span>u
            </div>
            <p className="text-xs text-sand-500 mt-1 font-mono tracking-wider">
              CURATED TROPICAL OOTD & PERSONAL COLOR STUDIO • JAKARTA, INDONESIA
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-semibold tracking-wider uppercase text-sand-300">
            <Link href="/about" className="hover:text-white transition-colors">
              About Look.u
            </Link>
            <a href="#trending" className="hover:text-white transition-colors">
              Lookbook
            </a>
            <a href="#studio" className="hover:text-white transition-colors">
              AI Stylist
            </a>
            <Link href="/lemari" className="hover:text-white transition-colors">
              Lemari Koleksi
            </Link>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <Link href="/studio" className="text-terracotta-500 hover:text-white transition-colors">
              Studio Mode ↗
            </Link>
          </div>
        </div>

        {/* Middle: Newsletter + Social */}
        <div className="py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border-b border-white/10">
          {/* Mini Newsletter */}
          <NewsletterForm />

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-5">
            <a
              href="https://instagram.com/looku.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-sand-300 hover:text-white transition-colors font-semibold uppercase tracking-wider"
              aria-label="Follow kami di Instagram"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              <span>Instagram</span>
            </a>
            <a
              href="https://tiktok.com/@looku.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-sand-300 hover:text-white transition-colors font-semibold uppercase tracking-wider"
              aria-label="Follow kami di TikTok"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.88 2.89 2.89 0 012.88-2.88c.28 0 .56.04.81.13V9.01a6.35 6.35 0 00-.81-.05A6.34 6.34 0 003.15 15.3 6.34 6.34 0 009.49 21.64a6.34 6.34 0 006.34-6.34V9.15a8.16 8.16 0 004.76 1.54V7.25a4.82 4.82 0 01-1-.56z"/></svg>
              <span>TikTok</span>
            </a>
            <a
              href="https://youtube.com/@looku_ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-sand-300 hover:text-white transition-colors font-semibold uppercase tracking-wider"
              aria-label="Subscribe YouTube look.u"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              <span>YouTube</span>
            </a>
            <a
              href="https://twitter.com/looku_ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-sand-300 hover:text-white transition-colors font-semibold uppercase tracking-wider"
              aria-label="Follow kami di X/Twitter"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              <span>X</span>
            </a>
          </div>
        </div>

        {/* Bottom Colophon & Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-sand-500">
          <div>
            © {new Date().getFullYear()} LOOK.U (LOOKU.AI). ALL RIGHTS RESERVED.
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <Link href="/privacy" className="hover:text-sand-300 transition-colors">
              Kebijakan Privasi
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-sand-300 transition-colors">
              Syarat & Ketentuan
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:text-sand-300 transition-colors">
              Tentang Kami
            </Link>
            <span>•</span>
            <span className="text-terracotta-400 font-bold">IKLIM TROPIS 33°C</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
