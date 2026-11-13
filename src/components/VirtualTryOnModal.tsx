"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  X,
  Sparkles,
  RotateCcw,
  Download,
  ExternalLink,
  CheckCircle2,
  Sliders,
  FlipHorizontal,
  ShieldCheck,
  Move,
  ZoomIn,
  ZoomOut,
  Layers,
  Columns,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { StudioItem } from "./StudioView";
import { TryOnAnalysisResult } from "@/app/api/try-on/route";

interface VirtualTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  heroImage: string;
  lookTitle: string;
  genderMode: "hijab" | "nonhijab" | "pria";
  items: StudioItem[];
}

const QUOTA_STORAGE_KEY = "looku_vto_quota_v1";
const MAX_DAILY_QUOTA = 3;

interface DailyQuotaState {
  date: string;
  used: number;
}

function getTodayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
}

export function getRemainingTryOnQuota(): number {
  if (typeof window === "undefined") return MAX_DAILY_QUOTA;
  try {
    const raw = localStorage.getItem(QUOTA_STORAGE_KEY);
    const today = getTodayDateString();
    if (!raw) return MAX_DAILY_QUOTA;
    const parsed: DailyQuotaState = JSON.parse(raw);
    if (parsed.date !== today) return MAX_DAILY_QUOTA;
    return Math.max(0, MAX_DAILY_QUOTA - (parsed.used || 0));
  } catch {
    return MAX_DAILY_QUOTA;
  }
}

export default function VirtualTryOnModal({
  isOpen,
  onClose,
  heroImage,
  lookTitle,
  genderMode,
  items,
}: VirtualTryOnModalProps) {
  // Step Flow: "capture" -> "preview" -> "processing" -> "result"
  const [step, setStep] = useState<"capture" | "preview" | "processing" | "result">("capture");
  const [remainingQuota, setRemainingQuota] = useState<number>(MAX_DAILY_QUOTA);

  // Camera & Input State
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [mirrorCamera, setMirrorCamera] = useState<boolean>(true);
  const [showGhostGuide, setShowGhostGuide] = useState<boolean>(true);
  const [capturedUserImage, setCapturedUserImage] = useState<string | null>(null);

  // Processing & AI Result State
  const [loadingStage, setLoadingStage] = useState<number>(0);
  const [aiGeneratedImage, setAiGeneratedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<TryOnAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Visual Mode in Result: "cosplay" (User Face on Studio Outfit), "garment_overlay" (Garment on User Photo), "side_by_side"
  const [visualMode, setVisualMode] = useState<"ai_native" | "cosplay" | "garment_overlay" | "side_by_side">("cosplay");

  // Interactive Fine-Tuning Offsets (User can drag or nudge to fit 100% seamlessly)
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [scaleAdjust, setScaleAdjust] = useState<number>(1.0);
  const [showFineTune, setShowFineTune] = useState<boolean>(false);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; origX: number; origY: number }>({
    x: 0,
    y: 0,
    origX: 0,
    origY: 0,
  });

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Load Quota on mount/open
  const syncQuota = useCallback(() => {
    const rem = getRemainingTryOnQuota();
    setRemainingQuota(rem);
  }, []);

  useEffect(() => {
    if (isOpen) {
      syncQuota();
    } else {
      stopCameraStream();
    }
  }, [isOpen, syncQuota]);

  const consumeOneQuota = () => {
    try {
      const today = getTodayDateString();
      const raw = localStorage.getItem(QUOTA_STORAGE_KEY);
      let used = 0;
      if (raw) {
        const parsed: DailyQuotaState = JSON.parse(raw);
        if (parsed.date === today) {
          used = parsed.used || 0;
        }
      }
      const nextUsed = Math.min(MAX_DAILY_QUOTA, used + 1);
      localStorage.setItem(
        QUOTA_STORAGE_KEY,
        JSON.stringify({ date: today, used: nextUsed })
      );
      setRemainingQuota(Math.max(0, MAX_DAILY_QUOTA - nextUsed));
    } catch {
      // Ignore storage error
    }
  };

  // Convenient Pitching Reset (Double click on Quota Badge resets 3/3 for demo!)
  const handleResetQuotaForDemo = () => {
    const today = getTodayDateString();
    localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify({ date: today, used: 0 }));
    setRemainingQuota(MAX_DAILY_QUOTA);
  };

  // Stop WebRTC Stream
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  // Start WebRTC Stream
  const startCameraStream = useCallback(async () => {
    setCameraError(null);
    stopCameraStream();
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(
          "Browser ini tidak mendukung akses kamera langsung. Silakan gunakan tombol Pilih Foto dari Galeri."
        );
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1080 },
          height: { ideal: 1350 },
        },
        audio: false,
      });
      streamRef.current = stream;
      setCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch {
      setCameraError(
        "Izin kamera belum diberikan atau perangkat tidak memiliki webcam. Anda tetap bisa memilih foto dari Galeri HP/Laptop!"
      );
      setCameraActive(false);
    }
  }, [facingMode, stopCameraStream]);

  useEffect(() => {
    if (isOpen && step === "capture") {
      startCameraStream();
    } else {
      stopCameraStream();
    }
    return () => {
      stopCameraStream();
    };
  }, [isOpen, step, facingMode, startCameraStream, stopCameraStream]);

  // Capture Snapshot from Live Video
  const handleCaptureCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    const targetW = 800;
    const targetH = 1000;
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const vw = video.videoWidth || 720;
    const vh = video.videoHeight || 900;
    const targetRatio = targetW / targetH;
    const videoRatio = vw / vh;

    let sx = 0;
    let sy = 0;
    let sw = vw;
    let sh = vh;

    if (videoRatio > targetRatio) {
      sw = vh * targetRatio;
      sx = (vw - sw) / 2;
    } else {
      sh = vw / targetRatio;
      sy = (vh - sh) / 2;
    }

    ctx.save();
    if (mirrorCamera && facingMode === "user") {
      ctx.translate(targetW, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, targetW, targetH);
    ctx.restore();

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedUserImage(dataUrl);
    stopCameraStream();
    setStep("preview");
  };

  // Upload Photo from Gallery
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Normalize to 4:5 portrait canvas (800x1000) for fast & clean API payload
        const canvas = document.createElement("canvas");
        const targetW = 800;
        const targetH = 1000;
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Fill warm studio backdrop if image aspect differs
        ctx.fillStyle = "#F5F2EB";
        ctx.fillRect(0, 0, targetW, targetH);

        const iw = img.width;
        const ih = img.height;
        const targetRatio = targetW / targetH;
        const imgRatio = iw / ih;

        let sx = 0;
        let sy = 0;
        let sw = iw;
        let sh = ih;

        if (imgRatio > targetRatio) {
          sw = ih * targetRatio;
          sx = (iw - sw) / 2;
        } else {
          sh = iw / targetRatio;
          sy = (ih - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetW, targetH);
        const normalizedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedUserImage(normalizedDataUrl);
        stopCameraStream();
        setStep("preview");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Run Hybrid Gemini Virtual Try-On
  const handleRunVirtualTryOn = async () => {
    if (!capturedUserImage) return;
    if (remainingQuota <= 0) {
      setErrorMessage(
        "Kuota harian Virtual Try-On Anda (3x/hari) telah habis. Silakan kembali besok atau klik 2x pada badge kuota untuk demo."
      );
      return;
    }

    setErrorMessage(null);
    setStep("processing");
    setLoadingStage(0);
    setOffsetX(0);
    setOffsetY(0);
    setScaleAdjust(1.0);

    const stageInterval = setInterval(() => {
      setLoadingStage((prev) => (prev < 2 ? prev + 1 : prev));
    }, 1300);

    try {
      const payloadItems = items.map((it) => ({
        category: it.categoryLabel,
        name: it.name,
        brand: it.brand,
        colorName: it.colorName,
        colorHex: it.colorHex,
        material: it.material,
        priceStr: it.priceStr,
        shopeeUrl: it.shopeeQuery
          ? `https://shopee.co.id/search?keyword=${encodeURIComponent(it.shopeeQuery)}`
          : `https://shopee.co.id/search?keyword=${encodeURIComponent(`${it.brand} ${it.name}`)}`,
      }));

      const res = await fetch("/api/try-on", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userImage: capturedUserImage,
          outfitImage: heroImage,
          lookTitle,
          genderMode,
          items: payloadItems,
        }),
      });

      const data = await res.json();
      clearInterval(stageInterval);

      if (!res.ok) {
        setErrorMessage(data.error || "Gagal memproses Virtual Try-On.");
        setStep("preview");
        return;
      }

      consumeOneQuota();
      setAnalysis(data.analysis || null);

      if (data.generatedImage) {
        setAiGeneratedImage(data.generatedImage);
        setVisualMode("ai_native");
      } else {
        setAiGeneratedImage(null);
        setVisualMode("cosplay");
      }

      setStep("result");
    } catch {
      clearInterval(stageInterval);
      setErrorMessage("Koneksi terputus saat menghubungi server AI. Silakan coba lagi.");
      setStep("preview");
    }
  };

  // ===========================================================================
  // SMART CANVAS COMPOSITOR FOR RESULT VIEW ("cosplay" | "garment_overlay" | "side_by_side")
  // ===========================================================================
  useEffect(() => {
    if (step !== "result" || !capturedUserImage || visualMode === "ai_native") return;
    const canvas = resultCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let isCancelled = false;

    const userImg = new Image();
    const outfitImg = new Image();
    userImg.crossOrigin = "anonymous";
    outfitImg.crossOrigin = "anonymous";

    let loadedCount = 0;
    const onBothLoaded = () => {
      if (isCancelled) return;
      const W = 800;
      const H = 1000;
      canvas.width = W;
      canvas.height = H;
      ctx.clearRect(0, 0, W, H);

      const align = analysis?.alignment || {
        userFace: { centerX: 0.5, centerY: 0.22, width: 0.24, height: 0.22 },
        userTorso: { centerX: 0.5, topY: 0.30, width: 0.62, height: 0.65 },
        modelHead: { centerX: 0.5, centerY: 0.16, width: 0.18, height: 0.16 },
        modelGarment: { centerX: 0.5, topY: 0.23, width: 0.56, height: 0.72 },
      };

      if (visualMode === "cosplay") {
        // ---------------------------------------------------------------------
        // MODE 1: COSPLAY STUDIO (Wajah & Leher User menyatu di atas Tubuh Outfit Studio)
        // ---------------------------------------------------------------------
        // 1. Draw Studio Outfit Hero as base
        ctx.drawImage(outfitImg, 0, 0, W, H);

        // 2. Extract User's Head/Face region and feather-blend onto Model's Head/Collar position
        const uf = align.userFace;
        const mh = align.modelHead;

        const srcW = Math.max(0.14, Math.min(0.45, uf.width * 1.35)) * userImg.width;
        const srcH = Math.max(0.14, Math.min(0.45, uf.height * 1.45)) * userImg.height;
        const srcX = Math.max(0, uf.centerX * userImg.width - srcW / 2);
        const srcY = Math.max(0, uf.centerY * userImg.height - srcH / 2);

        const dstW = Math.max(120, mh.width * 1.42 * W) * scaleAdjust;
        const dstH = Math.max(140, mh.height * 1.48 * H) * scaleAdjust;
        const dstCenterX = mh.centerX * W + offsetX;
        const dstCenterY = mh.centerY * H + offsetY;
        const dstX = dstCenterX - dstW / 2;
        const dstY = dstCenterY - dstH / 2;

        // Offscreen canvas for soft oval alpha feathering of user face
        const faceCanvas = document.createElement("canvas");
        faceCanvas.width = Math.round(dstW);
        faceCanvas.height = Math.round(dstH);
        const fCtx = faceCanvas.getContext("2d");
        if (fCtx) {
          fCtx.drawImage(
            userImg,
            srcX,
            srcY,
            srcW,
            srcH,
            0,
            0,
            faceCanvas.width,
            faceCanvas.height
          );

          // Apply elliptical radial feather mask so edges blend smoothly into collar/hair/hijab
          fCtx.globalCompositeOperation = "destination-in";
          fCtx.save();
          fCtx.translate(faceCanvas.width / 2, faceCanvas.height / 2);
          fCtx.scale(1, faceCanvas.height / faceCanvas.width);
          const radius = faceCanvas.width / 2;
          const grad = fCtx.createRadialGradient(0, 0, radius * 0.58, 0, 0, radius * 0.98);
          grad.addColorStop(0, "rgba(0,0,0,1)");
          grad.addColorStop(0.75, "rgba(0,0,0,0.92)");
          grad.addColorStop(1, "rgba(0,0,0,0)");
          fCtx.fillStyle = grad;
          fCtx.beginPath();
          fCtx.arc(0, 0, radius, 0, Math.PI * 2);
          fCtx.fill();
          fCtx.restore();

          ctx.drawImage(faceCanvas, dstX, dstY);
        }
      } else if (visualMode === "garment_overlay") {
        // ---------------------------------------------------------------------
        // MODE 2: BAJU DI FOTO SAYA (Potongan Pakaian Studio dipasang ke Tubuh Foto User)
        // ---------------------------------------------------------------------
        // 1. Draw User's Photo as base
        ctx.drawImage(userImg, 0, 0, W, H);

        // 2. Extract Model Garment torso (from collar down) with soft contour mask
        const mg = align.modelGarment;
        const ut = align.userTorso;

        const srcX = Math.max(0, (mg.centerX - mg.width / 2) * outfitImg.width);
        const srcY = Math.max(0, mg.topY * outfitImg.height);
        const srcW = Math.min(outfitImg.width - srcX, mg.width * outfitImg.width);
        const srcH = Math.min(outfitImg.height - srcY, mg.height * outfitImg.height);

        const dstW = ut.width * W * 1.08 * scaleAdjust;
        const dstH = ut.height * H * 1.08 * scaleAdjust;
        const dstX = ut.centerX * W - dstW / 2 + offsetX;
        const dstY = ut.topY * H + offsetY;

        const garmentCanvas = document.createElement("canvas");
        garmentCanvas.width = Math.max(10, Math.round(dstW));
        garmentCanvas.height = Math.max(10, Math.round(dstH));
        const gCtx = garmentCanvas.getContext("2d");

        if (gCtx) {
          gCtx.drawImage(
            outfitImg,
            srcX,
            srcY,
            srcW,
            srcH,
            0,
            0,
            garmentCanvas.width,
            garmentCanvas.height
          );

          // Soft silhouette mask (with rounded neck cutout at top center and soft side feathering)
          gCtx.globalCompositeOperation = "destination-in";
          const gw = garmentCanvas.width;
          const gh = garmentCanvas.height;

          // Create smooth garment contour
          const maskCanvas = document.createElement("canvas");
          maskCanvas.width = gw;
          maskCanvas.height = gh;
          const mCtx = maskCanvas.getContext("2d");
          if (mCtx) {
            mCtx.filter = "blur(14px)";
            mCtx.fillStyle = "#000000";
            mCtx.beginPath();
            // Shoulder left to right with collar dip
            mCtx.moveTo(gw * 0.12, gh * 0.04);
            mCtx.quadraticCurveTo(gw * 0.35, gh * 0.01, gw * 0.38, gh * 0.05);
            // Neck scoop so user's chin/neck stays visible
            mCtx.quadraticCurveTo(gw * 0.5, gh * 0.11, gw * 0.62, gh * 0.05);
            mCtx.quadraticCurveTo(gw * 0.65, gh * 0.01, gw * 0.88, gh * 0.04);
            // Right sleeve & torso down
            mCtx.quadraticCurveTo(gw * 0.96, gh * 0.25, gw * 0.86, gh * 0.96);
            mCtx.lineTo(gw * 0.14, gh * 0.96);
            mCtx.quadraticCurveTo(gw * 0.04, gh * 0.25, gw * 0.12, gh * 0.04);
            mCtx.closePath();
            mCtx.fill();

            gCtx.drawImage(maskCanvas, 0, 0);
          }

          ctx.drawImage(garmentCanvas, dstX, dstY);
        }
      } else if (visualMode === "side_by_side") {
        // ---------------------------------------------------------------------
        // MODE 3: SIDE-BY-SIDE EDITORIAL COMPARISON CARD
        // ---------------------------------------------------------------------
        ctx.fillStyle = "#FAF8F5";
        ctx.fillRect(0, 0, W, H);

        // Left half: User Photo
        ctx.save();
        ctx.beginPath();
        ctx.rect(16, 16, W / 2 - 22, H - 130);
        ctx.clip();
        ctx.drawImage(userImg, 16, 16, W / 2 - 22, H - 130);
        ctx.restore();

        // Right half: Studio Outfit
        ctx.save();
        ctx.beginPath();
        ctx.rect(W / 2 + 6, 16, W / 2 - 22, H - 130);
        ctx.clip();
        ctx.drawImage(outfitImg, W / 2 + 6, 16, W / 2 - 22, H - 130);
        ctx.restore();

        // Labels
        ctx.fillStyle = "rgba(24, 24, 24, 0.82)";
        ctx.fillRect(28, 28, 120, 28);
        ctx.fillRect(W / 2 + 18, 28, 145, 28);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText("FOTO ANDA", 42, 46);
        ctx.fillText("TARGET OUTFIT", W / 2 + 32, 46);
      }

      // Draw subtle Look.u AI Try-On Editorial Watermark Bar at bottom
      const barGrad = ctx.createLinearGradient(0, H - 110, 0, H);
      barGrad.addColorStop(0, "rgba(20, 20, 20, 0)");
      barGrad.addColorStop(0.45, "rgba(20, 20, 20, 0.72)");
      barGrad.addColorStop(1, "rgba(20, 20, 20, 0.92)");
      ctx.fillStyle = barGrad;
      ctx.fillRect(0, H - 110, W, 110);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 18px serif";
      ctx.fillText(`look.u Virtual Try-On · ${lookTitle}`, 24, H - 48);

      ctx.fillStyle = "#D6D3CD";
      ctx.font = "13px monospace";
      const scoreStr = `AI Fit Score: ${analysis?.fitScore || 96}% • Skin Tone: ${
        analysis?.detectedSkinTone || "Sawo Matang"
      } • 33°C Breathable`;
      ctx.fillText(scoreStr, 24, H - 22);
    };

    const checkLoaded = () => {
      loadedCount += 1;
      if (loadedCount === 2) {
        onBothLoaded();
      }
    };

    userImg.onload = checkLoaded;
    outfitImg.onload = checkLoaded;
    userImg.src = capturedUserImage;
    outfitImg.src = heroImage;

    return () => {
      isCancelled = true;
    };
  }, [
    step,
    capturedUserImage,
    heroImage,
    visualMode,
    analysis,
    offsetX,
    offsetY,
    scaleAdjust,
    lookTitle,
  ]);

  // Drag handlers on Result Canvas for 1-finger / mouse alignment
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (visualMode === "ai_native" || visualMode === "side_by_side") return;
    setIsDraggingCanvas(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      origX: offsetX,
      origY: offsetY,
    };
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingCanvas) return;
    const dx = (e.clientX - dragStartRef.current.x) * 1.4;
    const dy = (e.clientY - dragStartRef.current.y) * 1.4;
    setOffsetX(Math.round(dragStartRef.current.origX + dx));
    setOffsetY(Math.round(dragStartRef.current.origY + dy));
  };

  const handleCanvasPointerUp = () => {
    setIsDraggingCanvas(false);
  };

  // Download Try-On Image
  const handleDownloadResult = () => {
    if (visualMode === "ai_native" && aiGeneratedImage) {
      const link = document.createElement("a");
      link.download = `looku-tryon-${Date.now()}.png`;
      link.href = aiGeneratedImage;
      link.click();
      return;
    }
    if (resultCanvasRef.current) {
      const dataUrl = resultCanvasRef.current.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `looku-tryon-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[80] flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="relative w-full max-w-4xl bg-[#FAF8F5] border border-neutral-200 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[100dvh] sm:max-h-[92vh]"
        >
          {/* =============================================================== */}
          {/* HEADER MODAL + QUOTA 3X/HARI BADGE                              */}
          {/* =============================================================== */}
          <div className="px-4 sm:px-6 py-3.5 bg-white border-b border-neutral-200 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0">
                <Camera className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-terracotta-600 font-bold">
                    GEMINI HYBRID TRY-ON
                  </span>
                  <button
                    type="button"
                    onDoubleClick={handleResetQuotaForDemo}
                    title="Kuota Gratis 3x/hari (Klik 2x untuk reset saat demo pitching)"
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border transition-colors ${
                      remainingQuota > 0
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    Kuota Hari Ini: {remainingQuota}/{MAX_DAILY_QUOTA}
                  </button>
                </div>
                <h3 className="text-sm sm:text-base font-serif font-medium text-neutral-900 truncate">
                  Virtual Try-On Studio — {lookTitle}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* =============================================================== */}
          {/* BODY CONTENT                                                    */}
          {/* =============================================================== */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 1: CAMERA LIVE FRAMING GUIDE OR GALLERY UPLOAD           */}
            {/* ------------------------------------------------------------- */}
            {step === "capture" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                {/* Left 7 Col: Camera Viewfinder + Silhouette Pose Framing Guide */}
                <div className="md:col-span-7 space-y-3">
                  <div className="relative w-full aspect-[4/5] bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-inner">
                    {cameraActive ? (
                      <video
                        ref={videoRef}
                        playsInline
                        muted
                        autoPlay
                        className={`w-full h-full object-cover ${
                          mirrorCamera && facingMode === "user" ? "scale-x-[-1]" : ""
                        }`}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-white/80 space-y-3">
                        <Camera className="w-10 h-10 text-neutral-400" />
                        <p className="text-xs max-w-xs leading-relaxed text-neutral-300">
                          {cameraError ||
                            "Menyiapkan kamera... Anda juga bisa langsung memilih foto dari Galeri HP/Laptop di bawah."}
                        </p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-white text-neutral-900 rounded-lg text-xs font-semibold hover:bg-neutral-100 transition-colors"
                        >
                          Pilih Foto dari Galeri
                        </button>
                      </div>
                    )}

                    {/* Ghost Outfit Translucent Guide (Optional Toggle) */}
                    {showGhostGuide && (
                      <img
                        src={heroImage}
                        alt="Outfit Guide"
                        className="absolute inset-0 w-full h-full object-cover object-top opacity-25 pointer-events-none mix-blend-screen"
                      />
                    )}

                    {/* LIGHTWEIGHT POSE & SILHOUETTE FRAMING OVERLAY */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                      <svg
                        viewBox="0 0 400 500"
                        className="w-full h-full"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Head & Face Alignment Oval */}
                        <ellipse
                          cx="200"
                          cy="95"
                          rx="42"
                          ry="52"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          strokeDasharray="6 6"
                          fill="rgba(255,255,255,0.04)"
                        />
                        {/* Neck & Shoulder Guide Line */}
                        <path
                          d="M105 195 C125 162, 165 155, 200 155 C235 155, 275 162, 295 195"
                          stroke="#10B981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        {/* Shoulder Joint Markers */}
                        <circle cx="112" cy="188" r="6" fill="#10B981" />
                        <circle cx="288" cy="188" r="6" fill="#10B981" />
                        {/* Torso Frame */}
                        <path
                          d="M105 195 L88 380 M295 195 L312 380 M125 340 L275 340"
                          stroke="rgba(255,255,255,0.6)"
                          strokeWidth="1.8"
                          strokeDasharray="8 6"
                        />
                        {/* Corner Brackets */}
                        <path
                          d="M40 60 L40 35 L65 35 M360 60 L360 35 L335 35 M40 440 L40 465 L65 465 M360 440 L360 465 L335 465"
                          stroke="#FFFFFF"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>

                      {/* Floating Guide Labels */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono">
                        <span className="px-2.5 py-1 rounded-full bg-black/65 text-white backdrop-blur-xs">
                          Paskan Wajah &amp; Garis Bahu Hijau
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowGhostGuide((prev) => !prev)}
                          className="pointer-events-auto px-2.5 py-1 rounded-full bg-black/65 hover:bg-black text-white backdrop-blur-xs transition-colors"
                        >
                          {showGhostGuide ? "Siluet Baju: ON" : "Siluet Baju: OFF"}
                        </button>
                      </div>

                      {/* Camera Controls Mini Bar */}
                      {cameraActive && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 pointer-events-auto">
                          <button
                            type="button"
                            onClick={() => setMirrorCamera((prev) => !prev)}
                            className="p-2 rounded-full bg-black/65 hover:bg-black text-white backdrop-blur-xs"
                            title="Cermin Kamera"
                          >
                            <FlipHorizontal className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setFacingMode((prev) =>
                                prev === "user" ? "environment" : "user"
                              )
                            }
                            className="p-2 rounded-full bg-black/65 hover:bg-black text-white backdrop-blur-xs"
                            title="Putar Kamera Depan/Belakang"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Primary Action Buttons: Jepret Kamera OR Upload Galeri */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={handleCaptureCamera}
                      disabled={!cameraActive}
                      className="h-12 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Jepret Foto Kamera</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="h-12 bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Pilih Foto dari Galeri</span>
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Right 5 Col: Target Setelan Studio & Instructions */}
                <div className="md:col-span-5 space-y-4">
                  <div className="p-4 bg-white rounded-2xl border border-neutral-200 space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold block">
                      SETELAN YANG AKAN DICOBA
                    </span>
                    <div className="flex items-center gap-3">
                      <img
                        src={heroImage}
                        alt={lookTitle}
                        className="w-16 h-20 rounded-lg object-cover object-top border border-neutral-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-neutral-900 truncate">
                          {lookTitle}
                        </h4>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          {items.length} Komponen Pakaian Tropis
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {items.map((it) => (
                            <span
                              key={it.id}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-neutral-100 text-[9px] font-mono text-neutral-700"
                            >
                              <span
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: it.colorHex }}
                              />
                              {it.brand}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white rounded-2xl border border-neutral-200 space-y-2.5 text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-neutral-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Panduan Framing Terbaik</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-neutral-600 leading-relaxed list-disc pl-4">
                      <li>
                        Posisikan wajah di dalam <strong>oval putih</strong> dan bahu sejajar dengan <strong>garis hijau</strong>.
                      </li>
                      <li>
                        Lebih suka memakai foto yang sudah ada di HP/Laptop? Klik tombol <strong>Pilih Foto dari Galeri</strong>.
                      </li>
                      <li>
                        Foto Anda diproses secara aman dan hanya mengurangi kuota saat tombol proses ditekan.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 2: PREVIEW PHOTO BEFORE CONSUMING QUOTA                  */}
            {/* ------------------------------------------------------------- */}
            {step === "preview" && capturedUserImage && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-6">
                  <div className="relative w-full aspect-[4/5] bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
                    <img
                      src={capturedUserImage}
                      alt="Preview Anda"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 text-white text-[10px] font-mono">
                      Foto Siap Diproses
                    </span>
                  </div>
                </div>

                <div className="md:col-span-6 space-y-4">
                  <div className="p-5 bg-white rounded-2xl border border-neutral-200 space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-terracotta-600 font-bold">
                      KONFIRMASI VIRTUAL TRY-ON
                    </span>
                    <h4 className="text-lg font-serif text-neutral-900">
                      Pasang Setelan &ldquo;{lookTitle}&rdquo; ke Foto Ini?
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Mesin <strong>Hybrid Gemini Multimodal</strong> akan mendeteksi rona kulit Nusantara, posisi bahu &amp; wajah Anda, lalu memadukan setelan Studio lengkap dengan tautan belanja Shopee.
                    </p>

                    <div className="pt-2 space-y-2.5">
                      <button
                        type="button"
                        onClick={handleRunVirtualTryOn}
                        disabled={remainingQuota <= 0}
                        className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>
                          Proses AI Virtual Try-On (Sisa {remainingQuota}/{MAX_DAILY_QUOTA})
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCapturedUserImage(null);
                          setStep("capture");
                        }}
                        className="w-full h-11 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Ambil Ulang / Ganti Foto Lain</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 3: PROCESSING ANIMATION                                  */}
            {/* ------------------------------------------------------------- */}
            {step === "processing" && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative w-48 aspect-[4/5] rounded-2xl overflow-hidden border-2 border-neutral-900 shadow-lg">
                  {capturedUserImage && (
                    <img
                      src={capturedUserImage}
                      alt="Scanning"
                      className="w-full h-full object-cover opacity-80"
                    />
                  )}
                  <motion.div
                    animate={{ top: ["0%", "92%", "0%"] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute left-0 right-0 h-1 bg-emerald-400 shadow-[0_0_16px_#10B981]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 flex items-end justify-center p-3">
                    <span className="text-[10px] font-mono text-white uppercase tracking-wider">
                      Gemini Vision Scanning...
                    </span>
                  </div>
                </div>

                <div className="max-w-md space-y-2">
                  <h4 className="font-serif text-xl text-neutral-900">
                    Menyelaraskan Pakaian ke Tubuh Anda...
                  </h4>
                  <p className="text-xs text-neutral-600">
                    {loadingStage === 0 &&
                      "1/3 · Mendeteksi koordinat wajah, garis bahu & undertone kulit Nusantara..."}
                    {loadingStage === 1 &&
                      "2/3 · Menyesuaikan proporsi siluet & jatuh kain tropis 33°C..."}
                    {loadingStage >= 2 &&
                      "3/3 · Menyelesaikan komposisi Virtual Try-On & analisis kecocokan..."}
                  </p>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 4: RESULT VIEW + INTERACTIVE FIT + SHOPEE CONVERSION     */}
            {/* ------------------------------------------------------------- */}
            {step === "result" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* LEFT 6 COL: TRY-ON VISUAL CANVAS + MODE SWITCHER */}
                <div className="lg:col-span-6 space-y-3">
                  {/* Visual Mode Switcher Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-xl border border-neutral-200">
                    {aiGeneratedImage && (
                      <button
                        type="button"
                        onClick={() => setVisualMode("ai_native")}
                        className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
                          visualMode === "ai_native"
                            ? "bg-neutral-900 text-white shadow-2xs"
                            : "text-neutral-600 hover:bg-neutral-100"
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>AI Render</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setVisualMode("cosplay");
                        setOffsetX(0);
                        setOffsetY(0);
                        setScaleAdjust(1.0);
                      }}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
                        visualMode === "cosplay"
                          ? "bg-neutral-900 text-white shadow-2xs"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <UserCheck className="w-3 h-3" />
                      <span>Cosplay Fit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setVisualMode("garment_overlay");
                        setOffsetX(0);
                        setOffsetY(0);
                        setScaleAdjust(1.0);
                      }}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
                        visualMode === "garment_overlay"
                          ? "bg-neutral-900 text-white shadow-2xs"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <Layers className="w-3 h-3" />
                      <span>Overlay Baju</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVisualMode("side_by_side")}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
                        visualMode === "side_by_side"
                          ? "bg-neutral-900 text-white shadow-2xs"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <Columns className="w-3 h-3" />
                      <span>Bandingkan</span>
                    </button>
                  </div>

                  {/* Main Try-On Visual Frame */}
                  <div className="relative w-full aspect-[4/5] bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 shadow-md">
                    {visualMode === "ai_native" && aiGeneratedImage ? (
                      <img
                        src={aiGeneratedImage}
                        alt="AI Virtual Try-On"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <canvas
                        ref={resultCanvasRef}
                        onPointerDown={handleCanvasPointerDown}
                        onPointerMove={handleCanvasPointerMove}
                        onPointerUp={handleCanvasPointerUp}
                        onPointerLeave={handleCanvasPointerUp}
                        className={`w-full h-full object-cover touch-none ${
                          visualMode === "cosplay" || visualMode === "garment_overlay"
                            ? "cursor-grab active:cursor-grabbing"
                            : ""
                        }`}
                      />
                    )}

                    {/* Top Floating Controls on Result */}
                    {(visualMode === "cosplay" || visualMode === "garment_overlay") && (
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="px-2.5 py-1 rounded-full bg-black/65 text-white text-[10px] font-mono flex items-center gap-1 backdrop-blur-xs">
                          <Move className="w-3 h-3 text-emerald-400" />
                          <span>Geser gambar untuk sesuaikan posisi pas</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowFineTune((prev) => !prev)}
                          className="pointer-events-auto px-2.5 py-1 rounded-full bg-white/95 hover:bg-white text-neutral-900 text-[10px] font-semibold flex items-center gap-1 shadow-xs"
                        >
                          <Sliders className="w-3 h-3" />
                          <span>Ukuran</span>
                        </button>
                      </div>
                    )}

                    {/* Fine Tune Scale Bar */}
                    {showFineTune &&
                      (visualMode === "cosplay" || visualMode === "garment_overlay") && (
                        <div className="absolute bottom-16 left-3 right-3 p-2.5 rounded-xl bg-black/80 backdrop-blur-md text-white flex items-center justify-between gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() =>
                              setScaleAdjust((s) => Math.max(0.65, Number((s - 0.06).toFixed(2))))
                            }
                            className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25"
                            title="Perkecil"
                          >
                            <ZoomOut className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[10px] font-mono">
                            Skala Proporsi: {Math.round(scaleAdjust * 100)}%
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setScaleAdjust((s) => Math.min(1.5, Number((s + 0.06).toFixed(2))))
                            }
                            className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25"
                            title="Perbesar"
                          >
                            <ZoomIn className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setOffsetX(0);
                              setOffsetY(0);
                              setScaleAdjust(1.0);
                            }}
                            className="px-2 py-1 rounded bg-white/20 hover:bg-white/30 text-[10px] font-mono"
                          >
                            Reset
                          </button>
                        </div>
                      )}
                  </div>

                  {/* Bottom Action Buttons under Result Canvas */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadResult}
                      className="flex-1 h-11 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Simpan Foto Try-On</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStep("capture");
                      }}
                      className="h-11 px-4 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Foto Baru</span>
                    </button>
                  </div>
                </div>

                {/* RIGHT 6 COL: GEMINI AI FIT DIAGNOSIS + DIRECT SHOPEE CHECKOUT */}
                <div className="lg:col-span-6 space-y-4">
                  {/* AI Stylist Diagnosis Card */}
                  <div className="p-4 sm:p-5 bg-white rounded-2xl border border-neutral-200 space-y-3.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {analysis?.verdictTitle || "Sangat Cocok di Tubuh Anda"}
                      </span>
                      <span className="text-xs font-mono font-bold text-neutral-900">
                        Fit Score: {analysis?.fitScore || 96}%
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-neutral-200/80 text-center">
                        <span className="text-[9px] font-mono uppercase text-neutral-400 block">
                          Skin Tone Terdeteksi
                        </span>
                        <span className="text-[11px] font-bold text-neutral-900 mt-0.5 block truncate">
                          {analysis?.detectedSkinTone || "Sawo Matang"}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-neutral-200/80 text-center">
                        <span className="text-[9px] font-mono uppercase text-neutral-400 block">
                          Harmoni Warna
                        </span>
                        <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
                          {analysis?.colorHarmonyScore || 95}% Match
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-neutral-200/80 text-center">
                        <span className="text-[9px] font-mono uppercase text-neutral-400 block">
                          Kenyamanan 33°C
                        </span>
                        <span className="text-xs font-bold text-neutral-900 mt-0.5 block">
                          {analysis?.breathabilityScore || 98}% Adem
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {analysis?.stylistAnalysis}
                    </p>
                  </div>

                  {/* Direct Shopee Outfit Components Checkout List */}
                  <div className="p-4 sm:p-5 bg-white rounded-2xl border border-neutral-200 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold block">
                          BELI SETELAN YANG ANDA COBA ({items.length} ITEM)
                        </span>
                        <h4 className="text-xs font-bold text-neutral-900 mt-0.5">
                          Cocok di kamera? Langsung checkout di Shopee:
                        </h4>
                      </div>
                    </div>

                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {items.map((item) => {
                        const shopeeHref = item.shopeeQuery
                          ? `https://shopee.co.id/search?keyword=${encodeURIComponent(
                              item.shopeeQuery
                            )}`
                          : `https://shopee.co.id/search?keyword=${encodeURIComponent(
                              `${item.brand} ${item.name}`
                            )}`;
                        return (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-xl bg-[#FAF8F5] border border-neutral-200/80 flex items-center justify-between gap-2.5"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-11 h-12 rounded-lg object-cover object-top bg-white border border-neutral-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="text-[9px] font-mono font-bold uppercase text-neutral-500 block">
                                  {item.brand} · {item.colorName}
                                </span>
                                <p className="text-xs font-semibold text-neutral-900 truncate">
                                  {item.name}
                                </p>
                                <span className="text-[10px] font-mono text-neutral-600">
                                  Est. {item.priceStr}
                                </span>
                              </div>
                            </div>

                            <a
                              href={shopeeHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-2 rounded-lg bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[10px] font-mono font-semibold flex items-center gap-1 shrink-0 transition-colors"
                            >
                              <span>Shopee</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
