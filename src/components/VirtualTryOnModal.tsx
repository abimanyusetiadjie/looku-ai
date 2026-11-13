"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
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
  Shirt,
  Eye,
  EyeOff,
  Wand2,
  SlidersHorizontal,
} from "lucide-react";
import { StudioItem } from "./StudioView";
import { TryOnAnalysisResult } from "@/app/api/try-on/route";
import {
  ExtractedGarmentAsset,
  GarmentCropMode,
  LiveArMode,
  LiveRenderStats,
  NormalizedPoint,
  extractGarmentSprites,
  getVideoCoverCrop,
  getVideoPoseLandmarker,
  loadImageElement,
  renderLiveArVideoFrame,
} from "@/lib/live-ar-tryon";

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
  const [videoReady, setVideoReady] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [mirrorCamera, setMirrorCamera] = useState<boolean>(true);
  const [capturedUserImage, setCapturedUserImage] = useState<string | null>(null);
  const [capturedArImage, setCapturedArImage] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<"ar" | "raw">("ar");

  // Real-Time Live AR Pose State
  const [liveArMode, setLiveArMode] = useState<LiveArMode>("ar_garment");
  const [cropMode, setCropMode] = useState<GarmentCropMode>("auto");
  const [showTrackingGuide, setShowTrackingGuide] = useState<boolean>(false);
  const [showLiveAdjust, setShowLiveAdjust] = useState<boolean>(false);
  const [garmentOpacity, setGarmentOpacity] = useState<number>(0.94);
  const [liveScale, setLiveScale] = useState<number>(1.0);
  const [liveOffsetX, setLiveOffsetX] = useState<number>(0);
  const [liveOffsetY, setLiveOffsetY] = useState<number>(0);
  const [poseEngineStatus, setPoseEngineStatus] = useState<"loading" | "ready" | "fallback">(
    "loading"
  );
  const [garmentReady, setGarmentReady] = useState<boolean>(false);
  const [liveStats, setLiveStats] = useState<LiveRenderStats>({
    poseDetected: false,
    confidence: 0,
    bodyVisibility: "none",
  });

  // Processing & AI Result State
  const [loadingStage, setLoadingStage] = useState<number>(0);
  const [aiGeneratedImage, setAiGeneratedImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<TryOnAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Visual Mode in Result: "ai_native" | "live_ar" | "cosplay" | "garment_overlay" | "side_by_side"
  const [visualMode, setVisualMode] = useState<
    "ai_native" | "live_ar" | "cosplay" | "garment_overlay" | "side_by_side"
  >("cosplay");

  // Interactive Fine-Tuning Offsets in Result Canvas
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

  // Live AR Canvas drag tuning
  const liveDragRef = useRef<{ active: boolean; x: number; y: number; origX: number; origY: number }>({
    active: false,
    x: 0,
    y: 0,
    origX: 0,
    origY: 0,
  });

  // DOM & Engine Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const streamRequestSeqRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const liveArCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const resultCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const garmentAssetRef = useRef<ExtractedGarmentAsset | null>(null);
  const heroImageElRef = useRef<HTMLImageElement | null>(null);
  const smoothLandmarksRef = useRef<Record<number, NormalizedPoint>>({});
  const latestLandmarksRef = useRef<NormalizedLandmark[] | null>(null);
  const lastInferenceTimeRef = useRef<number>(0);
  const lastVideoTimeRef = useRef<number>(-1);
  const lastMpTimestampRef = useRef<number>(0);
  const lastStatsUpdateRef = useRef<number>(0);

  // Sync Mutable AR state into refs for zero-restart RAF rendering
  const liveConfigRef = useRef({
    liveArMode,
    cropMode,
    mirrorCamera,
    facingMode,
    showTrackingGuide,
    garmentOpacity,
    liveScale,
    liveOffsetX,
    liveOffsetY,
  });

  useEffect(() => {
    liveConfigRef.current = {
      liveArMode,
      cropMode,
      mirrorCamera,
      facingMode,
      showTrackingGuide,
      garmentOpacity,
      liveScale,
      liveOffsetX,
      liveOffsetY,
    };
  }, [
    liveArMode,
    cropMode,
    mirrorCamera,
    facingMode,
    showTrackingGuide,
    garmentOpacity,
    liveScale,
    liveOffsetX,
    liveOffsetY,
  ]);

  // Load Quota on mount/open
  const syncQuota = useCallback(() => {
    const rem = getRemainingTryOnQuota();
    setRemainingQuota(rem);
  }, []);

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

  // Stop WebRTC Stream cleanly without leaking hardware camera indicator
  const stopCameraStream = useCallback(() => {
    streamRequestSeqRef.current += 1;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
    setVideoReady(false);
  }, []);

  // Start WebRTC Stream with Multi-Tier Fallback for Mobile & Desktop
  const startCameraStream = useCallback(async () => {
    const reqId = ++streamRequestSeqRef.current;
    setCameraError(null);
    setVideoReady(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (reqId === streamRequestSeqRef.current) {
          setCameraError(
            "Browser ini tidak mendukung akses kamera langsung. Silakan gunakan tombol Pilih Foto dari Galeri."
          );
          setCameraActive(false);
        }
        return;
      }

      let stream: MediaStream | null = null;

      // Tier 1: Ideal 4:5 portrait resolution
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 960 },
            height: { ideal: 1200 },
          },
          audio: false,
        });
      } catch {
        // Tier 2: Flexible mobile resolution
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: facingMode },
            },
            audio: false,
          });
        } catch {
          // Tier 3: Permissive basic video stream
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }
      }

      if (!stream || reqId !== streamRequestSeqRef.current) {
        stream?.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      setCameraActive(true);

      const videoEl = videoRef.current;
      if (videoEl) {
        videoEl.setAttribute("playsinline", "true");
        videoEl.muted = true;
        if (videoEl.srcObject !== stream) {
          videoEl.srcObject = stream;
        }
        try {
          await videoEl.play();
        } catch {
          // Browsers may wait for metadata/user gesture
        }
        if (videoEl.readyState >= 2 && videoEl.videoWidth > 0) {
          setVideoReady(true);
        }
      }
    } catch {
      if (reqId === streamRequestSeqRef.current) {
        setCameraError(
          "Izin kamera belum diberikan atau perangkat tidak memiliki webcam aktif. Anda tetap bisa memilih foto dari Galeri HP/Laptop!"
        );
        setCameraActive(false);
      }
    }
  }, [facingMode]);

  // Reset modal flow whenever target look changes or modal closes
  useEffect(() => {
    setStep("capture");
    setCapturedUserImage(null);
    setCapturedArImage(null);
    setAiGeneratedImage(null);
    setAnalysis(null);
    setErrorMessage(null);
    setOffsetX(0);
    setOffsetY(0);
    setScaleAdjust(1.0);
    setLiveOffsetX(0);
    setLiveOffsetY(0);
    setLiveScale(1.0);
    smoothLandmarksRef.current = {};
    latestLandmarksRef.current = null;
  }, [heroImage]);

  useEffect(() => {
    if (isOpen) {
      syncQuota();
    } else {
      stopCameraStream();
      setStep("capture");
      setErrorMessage(null);
    }
  }, [isOpen, syncQuota, stopCameraStream]);

  // Manage camera stream lifecycle for Step 1 capture
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

  // Guarantee srcObject binding whenever <video> mounts after async camera acquisition
  useEffect(() => {
    const videoEl = videoRef.current;
    const stream = streamRef.current;
    if (isOpen && step === "capture" && cameraActive && videoEl && stream) {
      videoEl.setAttribute("playsinline", "true");
      videoEl.muted = true;
      if (videoEl.srcObject !== stream) {
        videoEl.srcObject = stream;
      }
      videoEl.play().catch(() => {});
      if (videoEl.readyState >= 2 && videoEl.videoWidth > 0) {
        setVideoReady(true);
      }
    }
  }, [isOpen, step, cameraActive]);

  // Preload MediaPipe Pose Engine & Extract Background-Removed Garment Sprite
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    setGarmentReady(false);
    setPoseEngineStatus("loading");

    // 1. Load hero image HTML element for instant AR Cosplay Studio mode
    loadImageElement(heroImage)
      .then((img) => {
        if (!cancelled) heroImageElRef.current = img;
      })
      .catch(() => {});

    // 2. Extract background-free garment sprite + anatomical landmarks from hero outfit
    extractGarmentSprites(heroImage)
      .then((asset) => {
        if (!cancelled) {
          garmentAssetRef.current = asset;
          setGarmentReady(Boolean(asset));
        }
      })
      .catch(() => {
        if (!cancelled) setGarmentReady(false);
      });

    // 3. Warm up real-time MediaPipe Video PoseLandmarker
    getVideoPoseLandmarker()
      .then((landmarker) => {
        if (!cancelled) {
          setPoseEngineStatus(landmarker ? "ready" : "fallback");
        }
      })
      .catch(() => {
        if (!cancelled) setPoseEngineStatus("fallback");
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen, heroImage]);

  // =========================================================================
  // REAL-TIME 30+ FPS LIVE AR RENDER & MEDIAPIPE POSE TRACKING LOOP
  // =========================================================================
  useEffect(() => {
    if (!isOpen || step !== "capture" || !cameraActive || !videoReady) return;

    let rafId = 0;
    let disposed = false;
    let activeLandmarker: Awaited<ReturnType<typeof getVideoPoseLandmarker>> = null;

    getVideoPoseLandmarker().then((lm) => {
      if (!disposed) activeLandmarker = lm;
    });

    const tick = (nowMs: number) => {
      if (disposed) return;

      const video = videoRef.current;
      const canvas = liveArCanvasRef.current;
      if (video && canvas && video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        const cfg = liveConfigRef.current;
        const mirrored = cfg.mirrorCamera && cfg.facingMode === "user";

        // Run MediaPipe inference cleanly at ~24 FPS without stalling canvas redraw
        if (
          activeLandmarker &&
          cfg.liveArMode !== "plain" &&
          video.currentTime !== lastVideoTimeRef.current &&
          nowMs - lastInferenceTimeRef.current >= 36
        ) {
          try {
            const perfNow = performance.now();
            const ts =
              perfNow > lastMpTimestampRef.current ? perfNow : lastMpTimestampRef.current + 1;
            lastMpTimestampRef.current = ts;
            lastVideoTimeRef.current = video.currentTime;
            lastInferenceTimeRef.current = nowMs;

            const result = activeLandmarker.detectForVideo(video, ts);
            latestLandmarksRef.current = result.landmarks?.[0] || null;
          } catch {
            // Keep running gracefully with previous landmarks if transient frame error
          }
        }

        const W = canvas.width;
        const H = canvas.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const stats = renderLiveArVideoFrame({
            ctx,
            canvasW: W,
            canvasH: H,
            video,
            mirrored,
            mode: cfg.liveArMode,
            cropMode: cfg.cropMode,
            garmentAsset: garmentAssetRef.current,
            heroImageEl: heroImageElRef.current,
            rawLandmarks: cfg.liveArMode === "plain" ? null : latestLandmarksRef.current,
            smoothBuffer: smoothLandmarksRef.current,
            options: {
              garmentOpacity: cfg.garmentOpacity,
              manualScale: cfg.liveScale,
              manualOffsetX: cfg.liveOffsetX,
              manualOffsetY: cfg.liveOffsetY,
              showTrackingGuide: cfg.showTrackingGuide,
              timeMs: nowMs,
            },
          });

          // Throttle React HUD badge updates (~4 Hz) so UI stays responsive without re-render lag
          if (nowMs - lastStatsUpdateRef.current >= 240) {
            lastStatsUpdateRef.current = nowMs;
            setLiveStats((prev) =>
              prev.poseDetected === stats.poseDetected &&
              prev.bodyVisibility === stats.bodyVisibility
                ? prev
                : stats
            );
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
    };
  }, [isOpen, step, cameraActive, videoReady]);

  // Direct finger/mouse dragging on Live AR Canvas
  const handleLivePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (liveArMode === "plain") return;
    liveDragRef.current = {
      active: true,
      x: e.clientX,
      y: e.clientY,
      origX: liveOffsetX,
      origY: liveOffsetY,
    };
  };

  const handleLivePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!liveDragRef.current.active) return;
    const dx = (e.clientX - liveDragRef.current.x) * 1.4;
    const dy = (e.clientY - liveDragRef.current.y) * 1.4;
    setLiveOffsetX(Math.round(liveDragRef.current.origX + dx));
    setLiveOffsetY(Math.round(liveDragRef.current.origY + dy));
  };

  const handleLivePointerUp = () => {
    liveDragRef.current.active = false;
  };

  // Capture Instant AR Frame + Clean Raw Frame from Live Video
  const handleCaptureCamera = () => {
    const video = videoRef.current;
    if (!video || video.videoWidth <= 0 || video.videoHeight <= 0) {
      setErrorMessage("Kamera masih menyiapkan gambar. Tunggu sebentar atau pilih foto dari Galeri.");
      return;
    }

    setErrorMessage(null);

    // 1. Capture Clean Raw Video Frame (800x1000 4:5 portrait) for AI Gemini Studio analysis
    const targetW = 800;
    const targetH = 1000;
    const rawCanvas = document.createElement("canvas");
    rawCanvas.width = targetW;
    rawCanvas.height = targetH;
    const rawCtx = rawCanvas.getContext("2d");
    if (!rawCtx) return;

    const crop = getVideoCoverCrop(video.videoWidth, video.videoHeight, targetW, targetH);
    const shouldMirror = mirrorCamera && facingMode === "user";

    rawCtx.save();
    if (shouldMirror) {
      rawCtx.translate(targetW, 0);
      rawCtx.scale(-1, 1);
    }
    rawCtx.drawImage(video, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, targetW, targetH);
    rawCtx.restore();
    const cleanDataUrl = rawCanvas.toDataURL("image/jpeg", 0.92);

    // 2. Capture Instant Live AR Composite Frame (wearing outfit right now!)
    let arDataUrl: string | null = null;
    if (liveArCanvasRef.current && liveArMode !== "plain") {
      try {
        arDataUrl = liveArCanvasRef.current.toDataURL("image/jpeg", 0.92);
      } catch {
        arDataUrl = null;
      }
    }

    setCapturedUserImage(cleanDataUrl);
    setCapturedArImage(arDataUrl);
    setPreviewTab(arDataUrl ? "ar" : "raw");
    stopCameraStream();
    setStep("preview");
  };

  // Download arbitrary dataUrl directly (for instant Live AR Snapshot save)
  const triggerDownloadDataUrl = (dataUrl: string, prefix = "looku-ar-tryon") => {
    const link = document.createElement("a");
    link.download = `${prefix}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Upload Photo from Gallery
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const targetW = 800;
        const targetH = 1000;
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

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
        setCapturedArImage(null);
        setPreviewTab("raw");
        stopCameraStream();
        setStep("preview");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Run Hybrid Gemini Virtual Try-On (Uses 1/3 Daily Quota)
  const handleRunVirtualTryOn = async () => {
    if (!capturedUserImage) return;
    if (remainingQuota <= 0) {
      setErrorMessage(
        "Kuota harian AI Try-On Anda (3x/hari) telah habis. Live AR Kamera tetap gratis tanpa batas! Atau klik 2x badge kuota untuk reset demo."
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
        setVisualMode(capturedArImage ? "live_ar" : "cosplay");
      }

      setStep("result");
    } catch {
      clearInterval(stageInterval);
      setErrorMessage("Koneksi terputus saat menghubungi server AI. Silakan coba lagi.");
      setStep("preview");
    }
  };

  // ===========================================================================
  // SMART CANVAS COMPOSITOR FOR RESULT VIEW
  // ===========================================================================
  useEffect(() => {
    if (
      step !== "result" ||
      !capturedUserImage ||
      visualMode === "ai_native" ||
      visualMode === "live_ar"
    )
      return;
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
        ctx.drawImage(outfitImg, 0, 0, W, H);

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
        ctx.drawImage(userImg, 0, 0, W, H);

        // Prefer segmented background-removed sprite when extracted cleanly
        const asset = garmentAssetRef.current;
        if (asset) {
          const ut = align.userTorso;
          const targetWidth = ut.width * W * 0.9 * scaleAdjust;
          const scale = targetWidth / asset.shoulderWidth;
          const spriteMidX = (asset.leftShoulder.x + asset.rightShoulder.x) / 2;
          const spriteMidY = (asset.leftShoulder.y + asset.rightShoulder.y) / 2;
          ctx.save();
          ctx.translate(ut.centerX * W + offsetX, ut.topY * H + offsetY);
          ctx.scale(scale, scale);
          ctx.globalAlpha = 0.96;
          ctx.drawImage(asset.fullCanvas, -spriteMidX, -spriteMidY);
          ctx.restore();
        } else {
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

            gCtx.globalCompositeOperation = "destination-in";
            const gw = garmentCanvas.width;
            const gh = garmentCanvas.height;

            const maskCanvas = document.createElement("canvas");
            maskCanvas.width = gw;
            maskCanvas.height = gh;
            const mCtx = maskCanvas.getContext("2d");
            if (mCtx) {
              mCtx.filter = "blur(14px)";
              mCtx.fillStyle = "#000000";
              mCtx.beginPath();
              mCtx.moveTo(gw * 0.12, gh * 0.04);
              mCtx.quadraticCurveTo(gw * 0.35, gh * 0.01, gw * 0.38, gh * 0.05);
              mCtx.quadraticCurveTo(gw * 0.5, gh * 0.11, gw * 0.62, gh * 0.05);
              mCtx.quadraticCurveTo(gw * 0.65, gh * 0.01, gw * 0.88, gh * 0.04);
              mCtx.quadraticCurveTo(gw * 0.96, gh * 0.25, gw * 0.86, gh * 0.96);
              mCtx.lineTo(gw * 0.14, gh * 0.96);
              mCtx.quadraticCurveTo(gw * 0.04, gh * 0.25, gw * 0.12, gh * 0.04);
              mCtx.closePath();
              mCtx.fill();

              gCtx.drawImage(maskCanvas, 0, 0);
            }

            ctx.drawImage(garmentCanvas, dstX, dstY);
          }
        }
      } else if (visualMode === "side_by_side") {
        ctx.fillStyle = "#FAF8F5";
        ctx.fillRect(0, 0, W, H);

        ctx.save();
        ctx.beginPath();
        ctx.rect(16, 16, W / 2 - 22, H - 130);
        ctx.clip();
        ctx.drawImage(userImg, 16, 16, W / 2 - 22, H - 130);
        ctx.restore();

        ctx.save();
        ctx.beginPath();
        ctx.rect(W / 2 + 6, 16, W / 2 - 22, H - 130);
        ctx.clip();
        ctx.drawImage(outfitImg, W / 2 + 6, 16, W / 2 - 22, H - 130);
        ctx.restore();

        ctx.fillStyle = "rgba(24, 24, 24, 0.82)";
        ctx.fillRect(28, 28, 120, 28);
        ctx.fillRect(W / 2 + 18, 28, 145, 28);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 12px sans-serif";
        ctx.fillText("FOTO ANDA", 42, 46);
        ctx.fillText("TARGET OUTFIT", W / 2 + 32, 46);
      }

      // Subtle Look.u Editorial Watermark
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

  // Drag handlers on Result Canvas
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (visualMode === "ai_native" || visualMode === "live_ar" || visualMode === "side_by_side")
      return;
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
      triggerDownloadDataUrl(aiGeneratedImage, "looku-ai-tryon");
      return;
    }
    if (visualMode === "live_ar" && capturedArImage) {
      triggerDownloadDataUrl(capturedArImage, "looku-ar-tryon");
      return;
    }
    if (resultCanvasRef.current) {
      const dataUrl = resultCanvasRef.current.toDataURL("image/png");
      triggerDownloadDataUrl(dataUrl, "looku-tryon");
    }
  };

  if (!isOpen) return null;

  const isMirrored = mirrorCamera && facingMode === "user";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="relative w-full max-w-4xl bg-[#FAF8F5] border-0 sm:border border-neutral-200 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[100dvh] sm:h-auto sm:max-h-[92vh]"
        >
          {/* =============================================================== */}
          {/* HEADER MODAL + LIVE AR & QUOTA 3X/HARI BADGE                    */}
          {/* =============================================================== */}
          <div className="px-4 sm:px-6 py-3 sm:py-3.5 bg-white border-b border-neutral-200 flex items-center justify-between gap-2.5 shrink-0 pt-[max(12px,env(safe-area-inset-top))]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0">
                <Camera className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider sm:tracking-widest text-terracotta-600 font-bold">
                    LIVE AR + GEMINI TRY-ON
                  </span>
                  <button
                    type="button"
                    onDoubleClick={handleResetQuotaForDemo}
                    title="Kuota Analisis AI Gratis 3x/hari (Live AR gratis tanpa batas! Klik 2x badge ini untuk reset demo)"
                    className={`px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-semibold border transition-colors ${
                      remainingQuota > 0
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    Kuota AI: {remainingQuota}/{MAX_DAILY_QUOTA}
                  </button>
                </div>
                <h3 className="text-xs sm:text-base font-serif font-medium text-neutral-900 truncate">
                  {lookTitle}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors shrink-0"
              aria-label="Tutup Try-On"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* =============================================================== */}
          {/* BODY CONTENT                                                    */}
          {/* =============================================================== */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-[max(20px,env(safe-area-inset-bottom))]">
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 1: REAL-TIME LIVE AR CAMERA MIRROR OR GALLERY UPLOAD      */}
            {/* ------------------------------------------------------------- */}
            {step === "capture" && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                {/* Left 7 Col: Live Camera + Real-Time MediaPipe AR Canvas */}
                <div className="md:col-span-7 space-y-3">
                  {/* Top Mode Tabs directly above camera */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-white border border-neutral-200 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => {
                        setLiveArMode("ar_garment");
                        setLiveOffsetX(0);
                        setLiveOffsetY(0);
                        setLiveScale(1.0);
                      }}
                      className={`py-2 px-2 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        liveArMode === "ar_garment"
                          ? "bg-neutral-900 text-white shadow-xs"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <Shirt className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Live Baju AR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLiveArMode("ar_cosplay");
                        setLiveOffsetX(0);
                        setLiveOffsetY(0);
                        setLiveScale(1.0);
                      }}
                      className={`py-2 px-2 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        liveArMode === "ar_cosplay"
                          ? "bg-neutral-900 text-white shadow-xs"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <Wand2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">AR Cosplay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setLiveArMode("plain")}
                      className={`py-2 px-2 rounded-lg text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        liveArMode === "plain"
                          ? "bg-neutral-900 text-white shadow-xs"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Kamera Polos</span>
                    </button>
                  </div>

                  {/* Camera Viewfinder Box (Video ALWAYS mounted inside for reliable capture!) */}
                  <div className="relative w-full aspect-[4/5] bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-inner">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      onLoadedMetadata={(e) => {
                        if (e.currentTarget.videoWidth > 0) {
                          setVideoReady(true);
                        }
                      }}
                      onPlaying={(e) => {
                        if (e.currentTarget.videoWidth > 0) {
                          setVideoReady(true);
                        }
                      }}
                      className={`absolute inset-0 w-full h-full object-cover z-0 ${
                        isMirrored ? "scale-x-[-1]" : ""
                      }`}
                    />

                    {/* Real-time AR Compositor Canvas layered over always-live video */}
                    {cameraActive && videoReady && (
                      <canvas
                        ref={liveArCanvasRef}
                        width={640}
                        height={800}
                        onPointerDown={handleLivePointerDown}
                        onPointerMove={handleLivePointerMove}
                        onPointerUp={handleLivePointerUp}
                        onPointerLeave={handleLivePointerUp}
                        className={`absolute inset-0 w-full h-full object-cover z-10 touch-none ${
                          liveArMode !== "plain" ? "cursor-grab active:cursor-grabbing" : ""
                        }`}
                      />
                    )}

                    {/* Initializing / Camera Permission Fallback Overlay */}
                    {(!cameraActive || !videoReady) && (
                      <div className="absolute inset-0 z-20 bg-neutral-900/95 flex flex-col items-center justify-center p-6 text-center text-white/85 space-y-3">
                        <Camera className="w-10 h-10 text-neutral-400 animate-pulse" />
                        <p className="text-xs max-w-xs leading-relaxed text-neutral-300">
                          {cameraError ||
                            "Menyiapkan kamera & Live AR Body Tracking... Atau Anda bisa langsung memilih foto dari Galeri."}
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

                    {/* Framing Silhouette SVG (Shown when plain mode OR AR guide toggled ON or no pose yet) */}
                    {cameraActive &&
                      videoReady &&
                      (liveArMode === "plain" ||
                        (liveArMode === "ar_garment" && !liveStats.poseDetected)) && (
                        <svg
                          viewBox="0 0 400 500"
                          className="absolute inset-0 w-full h-full z-20 pointer-events-none opacity-80"
                          fill="none"
                        >
                          <ellipse
                            cx="200"
                            cy="112"
                            rx="50"
                            ry="64"
                            stroke="rgba(255,255,255,0.72)"
                            strokeWidth="2"
                            strokeDasharray="6 6"
                          />
                          <path
                            d="M105 198 C125 166, 165 160, 200 160 C235 160, 275 166, 295 198"
                            stroke="#10B981"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          <circle cx="112" cy="192" r="5" fill="#10B981" />
                          <circle cx="288" cy="192" r="5" fill="#10B981" />
                        </svg>
                      )}

                    {/* Top Floating Status & Guide Toggle HUD */}
                    <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
                      <div className="px-2.5 py-1 rounded-full bg-black/70 text-white backdrop-blur-xs text-[10px] font-mono flex items-center gap-1.5 max-w-[68%] truncate">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            liveArMode === "plain"
                              ? "bg-neutral-400"
                              : liveStats.poseDetected
                              ? "bg-emerald-400 animate-pulse"
                              : "bg-amber-400"
                          }`}
                        />
                        <span className="truncate">
                          {liveArMode === "plain"
                            ? "Kamera Biasa · Panduan Bahu"
                            : poseEngineStatus === "loading" || !garmentReady
                            ? "Memuat Outfit Live AR..."
                            : liveStats.poseDetected
                            ? liveArMode === "ar_cosplay"
                              ? "Live AR Cosplay Aktif"
                              : "Live Tracking · Mengikuti Bahu"
                            : "Posisikan Wajah & Bahu di Kamera"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 pointer-events-auto">
                        {liveArMode !== "plain" && (
                          <button
                            type="button"
                            onClick={() => setShowTrackingGuide((prev) => !prev)}
                            className="px-2.5 py-1 rounded-full bg-black/70 hover:bg-black text-white text-[10px] font-mono backdrop-blur-xs flex items-center gap-1 transition-colors"
                            title="Tampilkan/Sembunyikan Titik Pose"
                          >
                            {showTrackingGuide ? (
                              <Eye className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <EyeOff className="w-3 h-3" />
                            )}
                            <span className="hidden sm:inline">Sendi</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Crop Selector Pills & Live Fine-Tune Drawer inside Bottom Left */}
                    {cameraActive && videoReady && liveArMode === "ar_garment" && (
                      <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1 pointer-events-auto">
                        {(
                          [
                            { id: "auto", label: "Auto" },
                            { id: "top_only", label: "Atasan" },
                            { id: "full_set", label: "Full Set" },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setCropMode(opt.id)}
                            className={`px-2 py-1 rounded-full text-[10px] font-mono backdrop-blur-xs transition-colors ${
                              cropMode === opt.id
                                ? "bg-emerald-500 text-white font-semibold"
                                : "bg-black/65 hover:bg-black text-white/85"
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Camera Controls Mini Bar Bottom Right */}
                    {cameraActive && (
                      <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5 pointer-events-auto">
                        {liveArMode !== "plain" && (
                          <button
                            type="button"
                            onClick={() => setShowLiveAdjust((prev) => !prev)}
                            className={`p-2 rounded-full backdrop-blur-xs text-white transition-colors ${
                              showLiveAdjust ? "bg-emerald-600" : "bg-black/65 hover:bg-black"
                            }`}
                            title="Atur Ukuran & Transparansi Baju"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5" />
                          </button>
                        )}
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

                    {/* Floating Live Calibration Panel (Scale / Opacity / Reset Drag) */}
                    {showLiveAdjust && cameraActive && videoReady && liveArMode !== "plain" && (
                      <div className="absolute bottom-14 left-3 right-3 z-30 p-3 rounded-xl bg-black/80 backdrop-blur-md text-white space-y-2 text-[11px]">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-mono text-[10px] text-neutral-300 w-16 shrink-0">
                            Ukuran: {Math.round(liveScale * 100)}%
                          </span>
                          <input
                            type="range"
                            min={0.7}
                            max={1.45}
                            step={0.02}
                            value={liveScale}
                            onChange={(e) => setLiveScale(Number(e.target.value))}
                            className="w-full accent-emerald-400"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-mono text-[10px] text-neutral-300 w-16 shrink-0">
                            Ketajaman: {Math.round(garmentOpacity * 100)}%
                          </span>
                          <input
                            type="range"
                            min={0.45}
                            max={1}
                            step={0.02}
                            value={garmentOpacity}
                            onChange={(e) => setGarmentOpacity(Number(e.target.value))}
                            className="w-full accent-emerald-400"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setLiveScale(1.0);
                              setLiveOffsetX(0);
                              setLiveOffsetY(0);
                              setGarmentOpacity(0.94);
                            }}
                            className="px-2 py-1 rounded bg-white/15 hover:bg-white/25 text-[10px] font-mono shrink-0"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Primary Action Buttons: Capture Instant Live AR Photo OR Upload Galeri */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={handleCaptureCamera}
                      disabled={!cameraActive || !videoReady}
                      className="h-12 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      <span>
                        {liveArMode !== "plain"
                          ? "Jepret Foto Live AR Ini"
                          : "Jepret Foto Kamera"}
                      </span>
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

                {/* Right 5 Col: Target Setelan Studio & Live Instructions */}
                <div className="md:col-span-5 space-y-4">
                  <div className="p-4 bg-white rounded-2xl border border-neutral-200 space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-semibold block">
                      SETELAN LIVE TRY-ON
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
                      <span>Cara Pakai Live AR Try-On</span>
                    </div>
                    <ul className="space-y-1.5 text-[11px] text-neutral-600 leading-relaxed list-disc pl-4">
                      <li>
                        <strong>Live Baju AR:</strong> Arahkan kamera ke bahu &amp; dada Anda—outfit otomatis terpasang dan mengikuti gerakan tubuh real-time!
                      </li>
                      <li>
                        <strong>AR Cosplay:</strong> Posisikan wajah untuk langsung masuk ke foto studio setelan lengkap detik itu juga.
                      </li>
                      <li>
                        Anda bisa <strong>geser baju langsung di layar kamera</strong> atau atur skala lewat ikon slider di kanan bawah kamera.
                      </li>
                      <li>
                        <strong>Gratis Tanpa Kuota:</strong> Live AR &amp; jepretan foto AR gratis. Kuota 3x/hari hanya terpakai jika menekan Proses Analisis AI Gemini.
                      </li>
                    </ul>
                  </div>

                  {/* Direct Quick Buy in Live AR View */}
                  <div className="p-3.5 bg-white rounded-2xl border border-neutral-200 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-semibold block">
                      CHECKOUT CEPAT SHOPEE
                    </span>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                      {items.map((item) => {
                        const shopeeHref = item.shopeeQuery
                          ? `https://shopee.co.id/search?keyword=${encodeURIComponent(item.shopeeQuery)}`
                          : `https://shopee.co.id/search?keyword=${encodeURIComponent(
                              `${item.brand} ${item.name}`
                            )}`;
                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between gap-2 py-1 border-b border-neutral-100 last:border-0"
                          >
                            <div className="min-w-0">
                              <p className="text-[11px] font-medium text-neutral-900 truncate">
                                {item.name}
                              </p>
                              <span className="text-[9px] font-mono text-neutral-500">
                                {item.brand} · {item.priceStr}
                              </span>
                            </div>
                            <a
                              href={shopeeHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 rounded bg-[#EE4D2D] hover:bg-[#D73211] text-white text-[9px] font-mono font-semibold flex items-center gap-1 shrink-0"
                            >
                              <span>Shopee</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* STEP 2: PREVIEW INSTANT AR PHOTO OR SEND TO GEMINI ANALYSIS   */}
            {/* ------------------------------------------------------------- */}
            {step === "preview" && capturedUserImage && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-6 space-y-2.5">
                  {capturedArImage && (
                    <div className="grid grid-cols-2 gap-1 p-1 bg-white rounded-xl border border-neutral-200">
                      <button
                        type="button"
                        onClick={() => setPreviewTab("ar")}
                        className={`py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                          previewTab === "ar"
                            ? "bg-neutral-900 text-white"
                            : "text-neutral-600 hover:bg-neutral-100"
                        }`}
                      >
                        Hasil Live AR
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewTab("raw")}
                        className={`py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                          previewTab === "raw"
                            ? "bg-neutral-900 text-white"
                            : "text-neutral-600 hover:bg-neutral-100"
                        }`}
                      >
                        Foto Kamera Polos
                      </button>
                    </div>
                  )}

                  <div className="relative w-full aspect-[4/5] bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm">
                    <img
                      src={
                        previewTab === "ar" && capturedArImage
                          ? capturedArImage
                          : capturedUserImage
                      }
                      alt="Preview Anda"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 text-white text-[10px] font-mono">
                      {previewTab === "ar" && capturedArImage
                        ? "Jepretan Live AR Siap Simpan"
                        : "Foto Siap Dianalisis Gemini"}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-6 space-y-4">
                  <div className="p-5 bg-white rounded-2xl border border-neutral-200 space-y-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-terracotta-600 font-bold">
                      PILIH TINDAKAN TRY-ON
                    </span>
                    <h4 className="text-lg font-serif text-neutral-900">
                      &ldquo;{lookTitle}&rdquo; di Foto Anda
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      Anda bisa langsung menyimpan hasil jepretan <strong>Live AR secara gratis</strong>, atau jalankan <strong>Gemini Vision Studio</strong> untuk cek skor undertone kulit Nusantara, kenyamanan 33°C, dan analisis detail.
                    </p>

                    <div className="pt-2 space-y-2.5">
                      {capturedArImage && (
                        <button
                          type="button"
                          onClick={() => triggerDownloadDataUrl(capturedArImage, "looku-ar-tryon")}
                          className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                        >
                          <Download className="w-4 h-4" />
                          <span>Simpan Foto Live AR Ini (Gratis · 0 Kuota)</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={handleRunVirtualTryOn}
                        disabled={remainingQuota <= 0}
                        className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>
                          Analisis Kecocokan &amp; Render Gemini (Sisa {remainingQuota}/{MAX_DAILY_QUOTA})
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setCapturedUserImage(null);
                          setCapturedArImage(null);
                          setStep("capture");
                        }}
                        className="w-full h-11 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Buka Kamera Live AR Lagi</span>
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
                  <div className="flex flex-wrap gap-1 bg-white p-1 rounded-xl border border-neutral-200">
                    {aiGeneratedImage && (
                      <button
                        type="button"
                        onClick={() => setVisualMode("ai_native")}
                        className={`flex-1 min-w-[70px] py-1.5 px-1.5 rounded-lg text-[10px] sm:text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
                          visualMode === "ai_native"
                            ? "bg-neutral-900 text-white shadow-2xs"
                            : "text-neutral-600 hover:bg-neutral-100"
                        }`}
                      >
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span className="truncate">AI Render</span>
                      </button>
                    )}

                    {capturedArImage && (
                      <button
                        type="button"
                        onClick={() => setVisualMode("live_ar")}
                        className={`flex-1 min-w-[70px] py-1.5 px-1.5 rounded-lg text-[10px] sm:text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
                          visualMode === "live_ar"
                            ? "bg-neutral-900 text-white shadow-2xs"
                            : "text-neutral-600 hover:bg-neutral-100"
                        }`}
                      >
                        <Shirt className="w-3 h-3 shrink-0" />
                        <span className="truncate">Live AR</span>
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
                      className={`flex-1 min-w-[70px] py-1.5 px-1.5 rounded-lg text-[10px] sm:text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
                        visualMode === "cosplay"
                          ? "bg-neutral-900 text-white shadow-2xs"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <UserCheck className="w-3 h-3 shrink-0" />
                      <span className="truncate">Cosplay</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setVisualMode("garment_overlay");
                        setOffsetX(0);
                        setOffsetY(0);
                        setScaleAdjust(1.0);
                      }}
                      className={`flex-1 min-w-[70px] py-1.5 px-1.5 rounded-lg text-[10px] sm:text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
                        visualMode === "garment_overlay"
                          ? "bg-neutral-900 text-white shadow-2xs"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <Layers className="w-3 h-3 shrink-0" />
                      <span className="truncate">Overlay Baju</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVisualMode("side_by_side")}
                      className={`flex-1 min-w-[70px] py-1.5 px-1.5 rounded-lg text-[10px] sm:text-[11px] font-medium flex items-center justify-center gap-1 transition-all ${
                        visualMode === "side_by_side"
                          ? "bg-neutral-900 text-white shadow-2xs"
                          : "text-neutral-600 hover:bg-neutral-100"
                      }`}
                    >
                      <Columns className="w-3 h-3 shrink-0" />
                      <span className="truncate">Bandingkan</span>
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
                    ) : visualMode === "live_ar" && capturedArImage ? (
                      <img
                        src={capturedArImage}
                        alt="Live AR Virtual Try-On"
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
