"use client";

import React, { useState } from "react";
import { X, ArrowRight, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WaitlistModalProps {
  onClose: () => void;
}

export default function WaitlistModal({ onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [name, setName] = useState("");
  const [favoriteStyle, setFavoriteStyle] = useState("Modest & Earthy Minimalist");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [totalWaitlist, setTotalWaitlist] = useState(412);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, whatsapp, name, favoriteStyle }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        if (data.totalWaitlist) setTotalWaitlist(data.totalWaitlist);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181A18]/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#D7CABC] overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-[#A89582] hover:text-[#181A18] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-terracotta-500" />
              <span className="lookbook-label">PRIVATE MEMBER INVITATION</span>
            </div>

            <h3 className="font-serif text-3xl font-bold text-[#181A18] tracking-tight">
              Akses Awal Eksklusif
            </h3>
            <p className="text-xs sm:text-sm text-[#181A18]/70 mt-2 mb-6 leading-relaxed">
              Daftarkan diri Anda untuk mendapatkan akses awal ke fitur Digital Wardrobe, kurasi lemari otomatis, dan kurasi outfit mingguan.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="lookbook-label block mb-1.5">
                  NAMA LENGKAP / PANGGILAN
                </label>
                <input
                  type="text"
                  placeholder="Misal: Nadia / Rizky"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D7CABC] focus:outline-none focus:border-[#181A18] text-xs sm:text-sm text-[#181A18]"
                />
              </div>

              <div>
                <label className="lookbook-label block mb-1.5">
                  EMAIL AKTIF <span className="text-terracotta-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D7CABC] focus:outline-none focus:border-[#181A18] text-xs sm:text-sm text-[#181A18]"
                />
              </div>

              <div>
                <label className="lookbook-label block mb-1.5">
                  WHATSAPP <span className="text-[#A89582] font-normal">(opsional)</span>
                </label>
                <input
                  type="tel"
                  placeholder="0812xxxxxxxx"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D7CABC] focus:outline-none focus:border-[#181A18] text-xs sm:text-sm text-[#181A18]"
                />
              </div>

              <div>
                <label className="lookbook-label block mb-1.5">
                  PREFERENSI GAYA UTAMA
                </label>
                <select
                  value={favoriteStyle}
                  onChange={(e) => setFavoriteStyle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#D7CABC] focus:outline-none focus:border-[#181A18] text-xs sm:text-sm text-[#181A18]"
                >
                  <option>Modest & Earthy Minimalist</option>
                  <option>Seoul Soft & Casual Knit</option>
                  <option>Clean Cut Monochrome</option>
                  <option>Smart Office Formal</option>
                  <option>Menswear Simple Relaxed</option>
                </select>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-3 py-3.5 px-4 rounded-xl bg-[#181A18] hover:bg-terracotta-500 text-white font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <span>MENDAFTARKAN KE MEMBER...</span>
                ) : (
                  <>
                    <span>GABUNG VIP PASS SEKARANG</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-4 text-center text-[10px] font-mono text-[#A89582] uppercase">
              100% BEBAS BIAYA • TANPA SPAM • PRIVASI TERJAMIN
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-12 h-12 bg-olive-50 text-olive-700 border border-olive-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-6 h-6" />
            </motion.div>
            <h4 className="font-serif text-2xl font-bold text-[#181A18]">Undangan Berhasil Disimpan</h4>
            <p className="text-xs sm:text-sm text-[#181A18]/70 mt-2 mb-6">
              Anda tercatat sebagai calon anggota prioritas <b>#{totalWaitlist}</b>. Kami akan mengirimkan notifikasi rilis akses ke <b>{email}</b>.
            </p>

            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 rounded-xl bg-[#181A18] text-white font-bold text-xs tracking-wider uppercase transition-all"
            >
              Kembali ke Studio
            </motion.button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
