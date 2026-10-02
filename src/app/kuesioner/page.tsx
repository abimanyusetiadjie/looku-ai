"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, Send, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const SUS_QUESTIONS = [
  "Saya berpikir akan sering menggunakan aplikasi ini untuk mencari inspirasi pakaian.",
  "Saya merasa aplikasi ini terlalu rumit, padahal bisa dibuat lebih sederhana.",
  "Saya merasa aplikasi ini mudah untuk digunakan.",
  "Saya merasa butuh bantuan teknis untuk bisa menggunakan aplikasi ini.",
  "Saya merasa berbagai fitur dalam aplikasi ini terintegrasi dengan sangat baik.",
  "Saya merasa ada banyak hal yang tidak konsisten pada aplikasi ini.",
  "Saya merasa mayoritas orang akan dapat mempelajari cara menggunakan aplikasi ini dengan cepat.",
  "Saya merasa aplikasi ini sangat tidak praktis saat digunakan.",
  "Saya merasa sangat percaya diri saat menggunakan aplikasi ini.",
  "Saya merasa harus belajar banyak hal terlebih dahulu sebelum bisa menggunakan aplikasi ini."
];

const VALIDATION_QUESTIONS = [
  "Konteks Cuaca: Rekomendasi bahan pakaian sesuai dengan cuaca di lokasi saya.",
  "Kesesuaian Warna: Pakaian yang direkomendasikan cocok dengan profil Personal Color saya.",
  "Kinerja AI: Penjelasan dari Chatbot membantu saya memahami alasan baju tersebut dipilihkan."
];

export default function KuesionerPage() {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "sus" | "validation" | "done">("intro");
  
  // State Jawaban
  const [susAnswers, setSusAnswers] = useState<Record<number, number>>({});
  const [valAnswers, setValAnswers] = useState<Record<number, number>>({});
  const [feedback, setFeedback] = useState("");

  const handleSusAnswer = (index: number, score: number) => {
    setSusAnswers(prev => ({ ...prev, [index]: score }));
  };

  const handleValAnswer = (index: number, score: number) => {
    setValAnswers(prev => ({ ...prev, [index]: score }));
  };

  const isSusComplete = Object.keys(susAnswers).length === SUS_QUESTIONS.length;
  const isValComplete = Object.keys(valAnswers).length === VALIDATION_QUESTIONS.length;

  const handleSubmit = () => {
    // Di sini nantinya data bisa dikirim ke Supabase. 
    // Untuk purwarupa, kita simpan di localStorage.
    const payload = {
      timestamp: new Date().toISOString(),
      sus: susAnswers,
      validation: valAnswers,
      feedback
    };
    localStorage.setItem("looku_kuesioner_result", JSON.stringify(payload));
    setStep("done");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-charcoal-900 selection:bg-terracotta-200 font-sans pb-24">
      {/* Header Minimalis */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8DFD1]">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center">
          <button onClick={() => router.push("/")} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal-900/70 hover:text-charcoal-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-10">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: INTRO */}
          {step === "intro" && (
            <motion.div key="intro" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 bg-white p-6 md:p-10 rounded-3xl border border-sand-300 shadow-tactile">
              <div className="w-12 h-12 rounded-full bg-terracotta-500/10 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-terracotta-600" />
              </div>
              <h1 className="font-serif text-3xl text-charcoal-900 font-medium">Evaluasi UX & Sistem Rekomendasi</h1>
              <p className="text-sm leading-relaxed text-charcoal-900/70">
                Terima kasih telah mencoba purwarupa <b>Look.u</b>. Kuesioner ini dirancang menggunakan standar <i>System Usability Scale (SUS)</i> untuk keperluan validasi Tugas Akhir/Capstone Project.<br/><br/>
                <b>Penting:</b> Pastikan Anda sudah mencoba fitur <b>Kuis Warna</b> dan <b>Chatbot AI</b> sebelum mengisi form ini.
              </p>
              <button 
                onClick={() => setStep("sus")}
                className="w-full sm:w-auto mt-4 px-8 py-4 rounded-full bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                Mulai Kuesioner
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: SUS QUESTIONS */}
          {step === "sus" && (
            <motion.div key="sus" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <span className="text-[10px] font-mono font-bold text-terracotta-600 bg-terracotta-50 px-2 py-1 rounded-full uppercase">Bagian 1 dari 2</span>
                <h2 className="font-serif text-2xl text-charcoal-900 mt-4 mb-2">System Usability Scale (SUS)</h2>
                <p className="text-xs text-charcoal-900/60">Skala 1 = Sangat Tidak Setuju, Skala 5 = Sangat Setuju.</p>
              </div>

              <div className="space-y-6">
                {SUS_QUESTIONS.map((q, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-sand-200 shadow-2xs space-y-4">
                    <p className="text-sm font-medium text-charcoal-900">
                      <span className="text-sand-400 mr-2">{idx + 1}.</span> {q}
                    </p>
                    <div className="flex items-center justify-between gap-2 max-w-sm">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          onClick={() => handleSusAnswer(idx, score)}
                          className={`w-10 h-10 rounded-full font-mono text-sm transition-all ${
                            susAnswers[idx] === score 
                              ? "bg-terracotta-500 text-white shadow-md border-2 border-terracotta-600" 
                              : "bg-sand-100 text-charcoal-900/60 hover:bg-sand-200 border border-sand-300"
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button 
                  disabled={!isSusComplete}
                  onClick={() => setStep("validation")}
                  className="px-8 py-4 rounded-full bg-charcoal-900 hover:bg-charcoal-800 text-white font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Lanjut Bagian 2
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: ALGORITHM VALIDATION */}
          {step === "validation" && (
            <motion.div key="validation" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <span className="text-[10px] font-mono font-bold text-terracotta-600 bg-terracotta-50 px-2 py-1 rounded-full uppercase">Bagian 2 dari 2</span>
                <h2 className="font-serif text-2xl text-charcoal-900 mt-4 mb-2">Validasi Mesin Rekomendasi AI</h2>
                <p className="text-xs text-charcoal-900/60">Skala 1 = Sangat Tidak Setuju, Skala 5 = Sangat Setuju.</p>
              </div>

              <div className="space-y-6">
                {VALIDATION_QUESTIONS.map((q, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-white border border-emerald-100 shadow-2xs space-y-4">
                    <p className="text-sm font-medium text-charcoal-900">
                      <span className="text-emerald-500 mr-2 font-bold">Q{idx + 1}.</span> {q}
                    </p>
                    <div className="flex items-center justify-between gap-2 max-w-sm">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          onClick={() => handleValAnswer(idx, score)}
                          className={`w-10 h-10 rounded-full font-mono text-sm transition-all ${
                            valAnswers[idx] === score 
                              ? "bg-emerald-600 text-white shadow-md border-2 border-emerald-700" 
                              : "bg-sand-100 text-charcoal-900/60 hover:bg-sand-200 border border-sand-300"
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Masukan Tambahan */}
                <div className="p-5 rounded-2xl bg-white border border-sand-200 shadow-2xs space-y-3">
                  <label className="text-sm font-medium text-charcoal-900 block">Kritik, Saran, atau Fitur Tambahan (Opsional)</label>
                  <textarea 
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Tuliskan pengalaman Anda..."
                    className="w-full p-4 rounded-xl border border-sand-300 bg-sand-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-terracotta-500/50 text-sm min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-sand-300">
                <button 
                  onClick={() => setStep("sus")}
                  className="px-6 py-4 rounded-full bg-sand-200 hover:bg-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali
                </button>
                <button 
                  disabled={!isValComplete}
                  onClick={handleSubmit}
                  className="px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Kirim Jawaban
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: DONE */}
          {step === "done" && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center space-y-6 py-20">
              <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-xl border-4 border-emerald-100">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="font-serif text-3xl text-charcoal-900">Terima Kasih!</h2>
                <p className="text-sm text-charcoal-900/60 max-w-sm mx-auto">
                  Tanggapan Anda telah berhasil disimpan dan sangat berarti untuk pengembangan penelitian algoritma kami.
                </p>
              </div>
              <Link href="/" className="mt-4 px-8 py-4 rounded-full bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-md">
                Kembali ke Beranda
              </Link>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
