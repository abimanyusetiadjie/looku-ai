"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, CheckCircle2, RotateCcw } from "lucide-react";

export type SkinToneId = "fair" | "light" | "medium" | "tan" | "deep";

interface CameraColorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTone: (tone: SkinToneId) => void;
}

const SKIN_TONE_REFERENCES = [
  { id: "fair", label: "Putih Gading (Fair)", hex: "#F5E6D3", desc: "Cool/Neutral Undertone", bgClass: "bg-[#F5E6D3]" },
  { id: "light", label: "Kuning Langsat (Light)", hex: "#F3D5B5", desc: "Warm/Neutral Undertone", bgClass: "bg-[#F3D5B5]" },
  { id: "medium", label: "Sawo Matang (Medium)", hex: "#D2A878", desc: "Warm Undertone", bgClass: "bg-[#D2A878]" },
  { id: "tan", label: "Eksotis (Tan)", hex: "#A87B4F", desc: "Warm/Deep Undertone", bgClass: "bg-[#A87B4F]" },
  { id: "deep", label: "Gelap (Deep)", hex: "#7A5030", desc: "Cool/Deep Undertone", bgClass: "bg-[#7A5030]" },
] as const;

export default function CameraColorGuideModal({ isOpen, onClose, onSelectTone }: CameraColorGuideModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState<SkinToneId | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setSelectedTone(null);
    }
    return () => stopCamera();
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access denied or failed:", err);
      setError("Izin kamera tidak diberikan atau perangkat tidak didukung. Kamera hanya aktif di perangkat Anda dan tidak disimpan.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleApply = () => {
    if (selectedTone) {
      onSelectTone(selectedTone);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-charcoal-900/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-sand-200"
        >
          {/* Header */}
          <div className="p-4 border-b border-sand-200 flex items-center justify-between bg-sand-50">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-charcoal-900" />
              <h2 className="font-serif font-bold text-charcoal-900">Guided Visual Color Match</h2>
            </div>
            <button onClick={onClose} className="p-2 bg-white rounded-full hover:bg-sand-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            <p className="text-xs text-charcoal-900/70 text-center px-4">
              Dekatkan pergelangan tangan Anda ke layar. Bandingkan warna kulit asli Anda dengan 5 kartu warna referensi (D65 standar) di bawah ini.
            </p>

            {/* Camera Viewport */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-charcoal-900 border-4 border-white shadow-inner flex items-center justify-center">
              {error ? (
                <div className="p-6 text-center text-white/80 text-xs">
                  <p>{error}</p>
                  <button onClick={startCamera} className="mt-4 px-4 py-2 bg-white text-charcoal-900 rounded-xl font-bold flex items-center gap-2 mx-auto">
                    <RotateCcw className="w-4 h-4" /> Coba Ulang Kamera
                  </button>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100" // mirror effect
                />
              )}
              
              {/* Reference Grid Overlay */}
              {!error && (
                <div className="absolute top-2 left-2 right-2 flex justify-between gap-1">
                  {SKIN_TONE_REFERENCES.map((ref) => (
                    <div key={ref.id} className="flex-1">
                      <div className={`h-12 w-full rounded-md shadow-sm border border-black/10 ${ref.bgClass}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selection Chips */}
            <div className="pt-2">
              <h3 className="text-[11px] font-bold text-center text-charcoal-900 mb-3 uppercase tracking-wider">
                Pilih Warna Paling Cocok
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {SKIN_TONE_REFERENCES.map((ref) => (
                  <button
                    key={ref.id}
                    onClick={() => setSelectedTone(ref.id)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                      selectedTone === ref.id ? "bg-terracotta-50 border-terracotta-400 ring-1 ring-terracotta-400" : "bg-white border-sand-200 hover:bg-sand-50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full shadow-sm border border-black/5 ${ref.bgClass} flex items-center justify-center`}>
                      {selectedTone === ref.id && <CheckCircle2 className="w-5 h-5 text-charcoal-900/60 drop-shadow-sm" />}
                    </div>
                    <span className="text-[9px] font-bold text-center leading-tight">
                      {ref.label.split(' ')[0]} <br/> {ref.label.split(' ')[1]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action */}
            <div className="pt-2">
              <button
                onClick={handleApply}
                disabled={!selectedTone}
                className="w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-charcoal-900 text-white hover:bg-terracotta-500"
              >
                Terapkan Personal Color
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
