import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Sparkles } from "lucide-react";

interface PersonalColorQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyResult: (skinToneId: "fair" | "light" | "medium" | "tan" | "deep") => void;
}

type QuestionId = 1 | 2 | 3;
type Answer = "A" | "B" | "C";

const QUESTIONS = [
  {
    id: 1,
    title: "Warna Urat Nadi di Pergelangan Tangan",
    options: [
      { id: "A", label: "Kehijauan (Warm Undertone)" },
      { id: "B", label: "Biru / Keunguan (Cool Undertone)" },
      { id: "C", label: "Campuran Biru & Hijau (Neutral Undertone)" },
    ],
  },
  {
    id: 2,
    title: "Perhiasan yang Paling Bikin Kulit Bersinar",
    options: [
      { id: "A", label: "Emas / Gold (Warm Tone)" },
      { id: "B", label: "Perak / White Gold (Cool Tone)" },
      { id: "C", label: "Dua-duanya cocok (Neutral Tone)" },
    ],
  },
  {
    id: 3,
    title: "Reaksi Kulit Saat Terpapar Panas Matahari",
    options: [
      { id: "A", label: "Mudah menggelap / tan (Jarang merah)" },
      { id: "B", label: "Mudah memerah / sunburn" },
      { id: "C", label: "Menggelap perlahan tapi tidak merah" },
    ],
  },
];

export default function PersonalColorQuizModal({
  isOpen,
  onClose,
  onApplyResult,
}: PersonalColorQuizModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [isResultLoading, setIsResultLoading] = useState(false);

  const handleSelectAnswer = (qId: number, ansId: Answer) => {
    setAnswers((prev) => ({ ...prev, [qId]: ansId }));
    
    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep((c) => c + 1), 300);
    } else {
      setIsResultLoading(true);
      setTimeout(() => {
        setIsResultLoading(false);
        setCurrentStep(QUESTIONS.length);
      }, 1500);
    }
  };

  const getResult = () => {
    const q3 = answers[3];
    const q1 = answers[1];
    
    if (q3 === "A") {
      return {
        type: "Warm Autumn (Sawo Matang & Golden)",
        skinTone: "tan" as const,
        palettes: [
          { name: "Terracotta", hex: "#E2725B" },
          { name: "Olive Green", hex: "#556B2F" },
          { name: "Mustard", hex: "#FFDB58" },
          { name: "Warm Brown", hex: "#8B4513" },
        ],
        avoid: ["Baby Blue", "Neon Pink"],
      };
    } else if (q3 === "B") {
      return {
        type: "Cool Summer (Putih Gading)",
        skinTone: "fair" as const,
        palettes: [
          { name: "Dusty Rose", hex: "#DCAE96" },
          { name: "Soft Lavender", hex: "#B57EDC" },
          { name: "Powder Blue", hex: "#B0E0E6" },
          { name: "Cool Grey", hex: "#8C92AC" },
        ],
        avoid: ["Orange", "Mustard Yellow"],
      };
    } else {
      return {
        type: "Neutral Spring (Kuning Langsat)",
        skinTone: "medium" as const,
        palettes: [
          { name: "Peach", hex: "#FFE5B4" },
          { name: "Sage Green", hex: "#9DC183" },
          { name: "Cream", hex: "#FFFDD0" },
          { name: "Soft Coral", hex: "#F88379" },
        ],
        avoid: ["Harsh Black", "Neon Green"],
      };
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E8DFD1] overflow-hidden flex flex-col max-h-[90vh]"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFD1]">
            <h2 className="font-serif font-bold text-lg text-[#181A18] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-terracotta-500" />
              Personal Color (60s)
            </h2>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-[#181A18]/60 hover:text-[#181A18] hover:bg-[#E8DFD1]/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {currentStep < QUESTIONS.length ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-2">
                  {QUESTIONS.map((q, idx) => (
                    <div
                      key={q.id}
                      className={`h-1.5 flex-1 rounded-full ${
                        idx <= currentStep ? "bg-terracotta-500" : "bg-[#E8DFD1]"
                      } transition-colors duration-300`}
                    />
                  ))}
                </div>
                
                <h3 className="text-xl font-medium text-[#181A18] mb-6">
                  {QUESTIONS[currentStep].title}
                </h3>

                <div className="space-y-3">
                  {QUESTIONS[currentStep].options.map((opt) => {
                    const isSelected = answers[QUESTIONS[currentStep].id] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectAnswer(QUESTIONS[currentStep].id, opt.id as Answer)}
                        className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-200 ${
                          isSelected
                            ? "border-terracotta-500 bg-terracotta-50 text-terracotta-900 shadow-sm"
                            : "border-[#E8DFD1] hover:border-terracotta-300 hover:bg-white text-[#181A18]"
                        }`}
                      >
                        <div className="font-medium">{opt.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : isResultLoading ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-8 h-8 text-terracotta-500" />
                </motion.div>
                <p className="text-sm font-medium text-[#181A18]/60 animate-pulse">
                  Menganalisa profil warna kamu...
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="inline-block px-3 py-1 bg-terracotta-100 text-terracotta-700 rounded-full text-xs font-bold tracking-wider uppercase mb-2">
                    Hasil Diagnosa
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-[#181A18]">
                    {getResult().type}
                  </h3>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#181A18]/60 uppercase tracking-wider">
                    Palet Warna Rekomendasi
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {getResult().palettes.map((p, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#E8DFD1]">
                        <div
                          className="w-8 h-8 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: p.hex }}
                        />
                        <span className="text-xs font-medium text-[#181A18]">{p.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#181A18]/60 uppercase tracking-wider">
                    Warna Yang Harus Dihindari
                  </h4>
                  <div className="flex gap-2">
                    {getResult().avoid.map((color, i) => (
                      <span key={i} className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg border border-red-100">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      onApplyResult(getResult().skinTone);
                      onClose();
                    }}
                    className="w-full py-4 px-6 rounded-xl bg-[#181A18] hover:bg-terracotta-600 text-white font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2 group"
                  >
                    🚀 Terapkan ke Studio & Generate OOTD
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={resetQuiz}
                    className="w-full mt-3 py-2 text-xs font-medium text-[#181A18]/60 hover:text-[#181A18] transition-colors"
                  >
                    Ulangi Tes
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
