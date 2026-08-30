"use client";

import React, { useRef, useState, useEffect } from "react";
import { X, Camera, RefreshCw, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LiveCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string) => void;
}

export default function LiveCameraModal({
  isOpen,
  onClose,
  onCapture,
}: LiveCameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startCamera = async (mode: "user" | "environment") => {
    try {
      setErrorMsg(null);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setErrorMsg("Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan.");
    }
  };

  useEffect(() => {
    if (isOpen && !capturedPhoto) {
      startCamera(facingMode);
    } else {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode, capturedPhoto]);

  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const handleTakeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (facingMode === "user") {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setCapturedPhoto(dataUrl);

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleConfirmPhoto = () => {
    if (capturedPhoto) {
      onCapture(capturedPhoto);
      handleClose();
    }
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera(facingMode);
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCapturedPhoto(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#181A18]/85 backdrop-blur-md overflow-hidden"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 20 }}
        className="relative max-w-sm w-full bg-[#181A18] text-[#FAF8F5] rounded-3xl overflow-hidden shadow-2xl border border-white/20 flex flex-col"
      >
        {/* Top Header */}
        <div className="p-4 flex items-center justify-between border-b border-white/10 z-10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-terracotta-500 flex items-center justify-center text-white">
              <Camera className="w-3.5 h-3.5" />
            </div>
            <span className="font-serif font-bold text-sm tracking-tight">
              Kamera Langsung look.u
            </span>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Viewport */}
        <div className="relative w-full aspect-[3/4] bg-black flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="absolute inset-0 bg-[#181A18] flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-500 mb-2">
                <X className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white">Izin Kamera Tidak Aktif</h3>
              <p className="text-sm text-white/70 max-w-[280px]">
                Tenang, kamu tetap bisa konsultasi! Unggah foto dari galeri atau ketik langsung pertanyaan outfitmu ke AI Stylist.
              </p>
              <div className="flex flex-col gap-3 w-full max-w-[240px] pt-4">
                <button
                  onClick={() => {
                    onClose();
                    // Optional: trigger gallery upload if possible, for now just close
                  }}
                  className="px-4 py-3 rounded-xl bg-white text-[#181A18] font-bold text-sm w-full"
                >
                  📁 Pilih Foto dari Galeri
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl bg-transparent border border-white/20 text-white font-bold text-sm hover:bg-white/10 w-full"
                >
                  ✕ Tutup & Ketik Pesan
                </button>
              </div>
            </div>
          ) : capturedPhoto ? (
            <img
              src={capturedPhoto}
              alt="Snapshot"
              className="w-full h-full object-cover"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${
                facingMode === "user" ? "scale-x-[-1]" : ""
              }`}
            />
          )}

          {/* Guidelines Overlay when Live */}
          {!capturedPhoto && !errorMsg && (
            <div className="absolute inset-4 sm:inset-6 border border-white/25 rounded-2xl pointer-events-none flex flex-col justify-between p-2 sm:p-3">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[9px] font-mono text-white/50 uppercase">
                  <span>[ FACE & BODY GUIDE ]</span>
                  <span className="text-emerald-400">● LIVE</span>
                </div>
                <div className="bg-black/75 backdrop-blur-md rounded-xl p-2.5 text-center border border-emerald-500/30 shadow-lg">
                  <p className="text-[10px] text-white font-medium flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span><b>Zero-Storage Guarantee:</b> Foto hanya dianalisis di RAM browser &amp; otomatis terhapus seketika.</span>
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-center text-[10px] font-mono text-white/90 bg-black/60 p-2 rounded-lg backdrop-blur-md border border-white/10">
                  💡 Tips: Kamu juga bisa mengarahkan kamera ke baju yang digantung atau ditaruh di kasur (flatlay).
                </div>
                <div className="text-center text-[10px] font-mono text-white/70 bg-black/40 py-1 rounded-md backdrop-blur-xs">
                  Posisikan wajah & badan di dalam bingkai
                </div>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Action Controls */}
        <div className="p-4 bg-[#181A18] border-t border-white/10 flex items-center justify-around">
          {capturedPhoto ? (
            <div className="w-full flex items-center gap-3">
              <button
                onClick={handleRetake}
                className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Foto Ulang
              </button>

              <button
                onClick={handleConfirmPhoto}
                className="flex-1 py-3 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Gunakan Foto</span>
              </button>
            </div>
          ) : (
            <div className="w-full flex items-center justify-between px-4">
              {/* Flip Camera Button */}
              <button
                onClick={handleFlipCamera}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Ganti Kamera Depan/Belakang"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              {/* Big Shutter Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleTakeSnapshot}
                className="w-16 h-16 rounded-full border-4 border-white p-1 flex items-center justify-center shadow-lg"
              >
                <div className="w-full h-full rounded-full bg-white hover:bg-[#F4EFE6] transition-colors" />
              </motion.button>

              {/* Spacer for symmetry */}
              <div className="w-11" />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
