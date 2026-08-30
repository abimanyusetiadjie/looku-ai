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

  const [selectedDrapeColor, setSelectedDrapeColor] = useState<{ name: string; hex: string } | null>(null);

  const handleSelectAnswer = (qId: number, ansId: Answer) => {
    setAnswers((prev) => ({ ...prev, [qId]: ansId }));
    
    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentStep((c) => c + 1), 300);
    } else {
      setIsResultLoading(true);
      setTimeout(() => {
        setIsResultLoading(false);
        setCurrentStep(QUESTIONS.length);
        const res = getResult();
        if (res.palettes.length > 0) {
          setSelectedDrapeColor(res.palettes[0]);
        }
      }, 1200);
    }
  };

  const getResult = () => {
    const q3 = answers[3];
    const q1 = answers[1];
    
    if (q3 === "A") {
      return {
        type: "Warm Autumn (Sawo Matang & Golden)",
        skinTone: "tan" as const,
        undertoneDesc: "Undertone hangat kaya pigmen keemasan, sangat cocok dengan nuansa tanah (earth tones).",
        palettes: [
          { name: "Terracotta", hex: "#E2725B" },
          { name: "Olive Green", hex: "#556B2F" },
          { name: "Mustard Gold", hex: "#D4AF37" },
          { name: "Warm Brown", hex: "#8B4513" },
        ],
        avoid: ["Baby Blue Pucat", "Neon Pink"],
      };
    } else if (q3 === "B") {
      return {
        type: "Cool Summer (Putih Gading)",
        skinTone: "fair" as const,
        undertoneDesc: "Undertone sejuk elegan, bersinar maksimal dengan palet warna pastel & dusty mutiara.",
        palettes: [
          { name: "Dusty Rose", hex: "#DCAE96" },
          { name: "Soft Lavender", hex: "#B57EDC" },
          { name: "Powder Blue", hex: "#B0E0E6" },
          { name: "Cool Grey", hex: "#8C92AC" },
        ],
        avoid: ["Mustard Menyala", "Orange Terang"],
      };
    } else {
      return {
        type: "Warm Spring (Kuning Langsat)",
        skinTone: "medium" as const,
        undertoneDesc: "Undertone netral-hangat khas Nusantara, sangat cerah dipadukan dengan warna segar floral.",
        palettes: [
          { name: "Warm Peach", hex: "#FFE5B4" },
          { name: "Coral Bloom", hex: "#FF7F50" },
          { name: "Sage Green", hex: "#9CA986" },
          { name: "Ivory White", hex: "#FFFFF0" },
        ],
        avoid: ["Hitam Pekat", "Abu-Abu Kusam"],
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
      <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center p-0 sm:p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="relative w-full max-w-md bg-[#FAF8F5] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E8DFD1] overflow-hidden flex flex-col h-[85dvh] sm:h-auto sm:max-h-[90vh] pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
        >
          {/* Mobile Pull Handle Indicator */}
          <div className="sm:hidden w-full flex justify-center pt-2.5 pb-1">
            <div className="w-10 h-1 rounded-full bg-sand-300" />
          </div>

          <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#E8DFD1]">
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
                <div className="text-center space-y-1.5 border-b border-[#E8DFD1] pb-4">
                  <span className="text-[10px] font-mono tracking-widest uppercase px-3 py-1 bg-sand-100 text-charcoal-900 rounded-full font-bold border border-sand-300">
                    HASIL DIAGNOSA ATELIER
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#181A18] pt-1">
                    {getResult().type}
                  </h3>
                  <p className="text-xs text-[#181A18]/70 max-w-sm mx-auto">
                    {getResult().undertoneDesc}
                  </p>
                </div>

                {/* Virtual Fabric Drape Interactive Simulator */}
                {selectedDrapeColor && (
                  <div className="p-4 rounded-2xl border border-sand-300 bg-white space-y-2.5 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-sand-500">
                        SIMULASI DRAPING KAIN
                      </span>
                      <span className="text-[10px] font-mono font-bold text-terracotta-600 bg-terracotta-50 px-2 py-0.5 rounded-full">
                        +98.4% NATURAL GLOW
                      </span>
                    </div>

                    <div 
                      className="h-20 rounded-xl border border-black/10 flex items-center justify-center p-3 relative overflow-hidden transition-all duration-300"
                      style={{ backgroundColor: selectedDrapeColor.hex }}
                    >
                      <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/40 shadow-xs flex items-center gap-2">
                        <span className="text-xs font-bold font-serif text-charcoal-900">
                          {selectedDrapeColor.name} ({selectedDrapeColor.hex})
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-sand-600 italic text-center">
                      Tap salah satu warna di bawah untuk melihat efek kecerahan kain pada kulitmu:
                    </p>
                  </div>
                )}

                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-mono font-bold text-charcoal-900 uppercase tracking-wider">
                    Palet Warna Kekuatan (Power Colors)
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {getResult().palettes.map((p, i) => {
                      const isActive = selectedDrapeColor?.hex === p.hex;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setSelectedDrapeColor(p)}
                          className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                            isActive
                              ? "bg-sand-100 border-charcoal-900 shadow-2xs font-bold"
                              : "bg-white border-sand-200 hover:border-sand-300"
                          }`}
                        >
                          <div
                            className="w-7 h-7 rounded-full border border-black/10 shadow-xs shrink-0"
                            style={{ backgroundColor: p.hex }}
                          />
                          <div className="truncate">
                            <div className="text-xs text-charcoal-900 truncate">{p.name}</div>
                            <div className="text-[9px] font-mono text-sand-500">{p.hex}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[11px] font-mono font-bold text-charcoal-900 uppercase tracking-wider">
                    Warna yang Perlu Dihindari (Washed Out)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {getResult().avoid.map((color, i) => (
                      <span key={i} className="px-2.5 py-1 bg-sand-100 text-charcoal-700 text-[11px] font-medium rounded-lg border border-sand-200">
                        {color}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-sand-200">
                  <button
                    onClick={() => {
                      onApplyResult(getResult().skinTone);
                      onClose();
                    }}
                    className="w-full py-3.5 px-6 rounded-2xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 group"
                  >
                    <span>Terapkan ke Studio &amp; Generate OOTD</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={resetQuiz}
                    className="w-full mt-2 py-1.5 text-xs font-semibold text-sand-500 hover:text-charcoal-900 transition-colors"
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
