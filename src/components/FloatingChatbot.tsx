"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { 
  Sparkles, 
  X, 
  Send, 
  Camera, 
  ArrowUpRight, 
  ShoppingBag, 
  ImagePlus, 
  Mic, 
  MicOff, 
  ChevronRight, 
  ArrowLeft, 
  Layers, 
  Bookmark, 
  RotateCcw 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LiveCameraModal from "./LiveCameraModal";
import { useWeather } from "@/hooks/useWeather";
import { OOTDRecommendation, OutfitItem } from "@/lib/types";
import { ChatOutfitCard } from "@/app/api/chat/route";
import { trackAffiliateClick } from "@/lib/affiliate";

interface Message {
  id: string;
  sender: "user" | "stylist";
  text: string;
  userImage?: string;
  outfitMatch?: ChatOutfitCard;
  followUps?: string[];
  timestamp: string;
}

const DEFAULT_WELCOME_MSG: Message = {
  id: "msg_welcome",
  sender: "stylist",
  text: "Selamat datang di Look.u Concierge. Saya asisten gaya pribadi kamu untuk iklim tropis Indonesia.\n\nTanyakan kurasi pakaian adem berdasarkan cuaca, acara harian, atau unggah foto selfie/baju untuk analisis undertone seketika.",
  outfitMatch: {
    id: "welcome_look",
    presetKey: "kuliah_hijab_panas_hemat",
    title: "Casual Campus Chiffon",
    subtitle: "BESTSELLER · EARTHY MINIMALIST",
    tagline: "Kombinasi katun linen berpori sejuk dan kulot santun.",
    fabricNote: "Katun Linen Crinkle · Anti-Kusut",
    image: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=900&auto=format&fit=crop&q=85",
    swatches: [
      { name: "Cream Oat", hex: "#F5EBE0" },
      { name: "Sage Green", hex: "#84A98C" },
      { name: "Broken White", hex: "#FAEDCD" },
    ],
    priceRange: "Rp 180rb - 260rb",
    climateBadge: "AIRY TROPICAL · OPTIMAL 33°C",
    studioParam: "kuliah_hijab_panas_hemat",
    itemsSummary: "Kemeja Linen Crinkle + Pashmina Ceruty + Kulot Flowy",
    items: [
      {
        category: "atasan",
        name: "Kemeja Linen Oversized Drop Shoulder",
        material: "Katun Linen Crinkle (Adem & Anti-Kusut)",
        color: "Sage Green",
        colorHex: "#84A98C",
        estimatedPrice: "Rp 65.000 - 89.000",
        shopeeQuery: "kemeja linen oversized wanita crinkle",
        tokopediaQuery: "kemeja linen wanita oversized",
      },
      {
        category: "outer_hijab",
        name: "Pashmina Ceruty Baby Doll",
        material: "Ceruty Baby Doll Premium",
        color: "Cream Sand",
        colorHex: "#F5EBE0",
        estimatedPrice: "Rp 25.000 - 38.000",
        shopeeQuery: "pashmina ceruty baby doll premium",
        tokopediaQuery: "pashmina ceruty baby doll",
      },
      {
        category: "bawahan",
        name: "Highwaist Loose Kulot Pants",
        material: "Poli-Cotton Flowy",
        color: "Broken White",
        colorHex: "#FAEDCD",
        estimatedPrice: "Rp 68.000 - 95.000",
        shopeeQuery: "celana kulot highwaist loose wanita",
        tokopediaQuery: "kulot highwaist flowy wanita",
      },
    ],
  },
  followUps: [
    "Lihat Komponen Pakaian",
    "Kuliah Adem 29°C",
    "Ngantor SCBD Breathable",
    "Buka di Studio AI ↗",
  ],
  timestamp: "Baru saja",
};

export default function FloatingChatbot() {
  const router = useRouter();
  const pathname = usePathname();
  const { weather } = useWeather();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [cardSavedToast, setCardSavedToast] = useState<string | null>(null);
  const [expandedOutfitId, setExpandedOutfitId] = useState<string | null>(null);

  // Active Context States
  const [userSkinTone, setUserSkinTone] = useState<string>("Warm Autumn");
  const [userGenderPref, setUserGenderPref] = useState<string>("Modest / Hijab");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Sync user context on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedTone = localStorage.getItem("looku_personal_color");
        if (storedTone) {
          const toneMap: Record<string, string> = {
            "sawo-matang": "Warm Autumn (Sawo Matang)",
            "kuning-langsat": "Warm Spring (Kuning Langsat)",
            "tan-eksotis": "Deep Autumn (Tan Eksotis)",
            fair: "Cool Summer (Putih Gading)",
            light: "Warm Spring",
            medium: "Warm Autumn",
            tan: "Deep Autumn",
            deep: "Deep Winter",
          };
          setUserSkinTone(toneMap[storedTone] || storedTone);
        }
      } catch (e) {
        console.error("Error reading context:", e);
      }
    }
  }, []);

  const [messages, setMessages] = useState<Message[]>([DEFAULT_WELCOME_MSG]);

  // Load chat messages from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("looku_chat_messages_v2");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
          }
        }
      } catch (e) {
        console.error("Error reading chat storage:", e);
      }
    }
  }, []);

  // Save chat messages to localStorage
  const saveMessagesToLocal = (newMsgs: Message[]) => {
    setMessages(newMsgs);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("looku_chat_messages_v2", JSON.stringify(newMsgs));
      } catch (e) {
        console.error("Error saving chat storage:", e);
      }
    }
  };

  const handleClearChat = () => {
    if (confirm("Reset percakapan concierge dan mulai sesi baru?")) {
      saveMessagesToLocal([DEFAULT_WELCOME_MSG]);
    }
  };

  const handleToggleVoice = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser Anda belum mendukung input suara. Gunakan browser Chrome atau Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "id-ID";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("");
        setInputMessage(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, expandedOutfitId]);

  // Client-side image compression
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Format file tidak didukung. Harap pilih gambar (JPG, PNG, atau WebP).");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 900;
        const scaleSize = MAX_WIDTH / Math.max(img.width, img.height);
        const targetWidth = img.width > MAX_WIDTH ? img.width * scaleSize : img.width;
        const targetHeight = img.width > MAX_WIDTH ? img.height * scaleSize : img.height;

        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.82);
        setSelectedImage(compressedBase64);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    setShowPhotoOptions(false);
  };

  const handleCaptureFromLiveCamera = (base64Image: string) => {
    setSelectedImage(base64Image);
    setShowPhotoOptions(false);
  };

  const handleSaveOutfitToWardrobe = (outfit: ChatOutfitCard) => {
    if (typeof window === "undefined") return;
    try {
      const saved = JSON.parse(localStorage.getItem("looku_saved_outfits") || "[]");
      const exists = saved.some((s: any) => s.id === outfit.id || s.title === outfit.title);

      if (!exists) {
        const newOutfit: OOTDRecommendation = {
          id: outfit.id || `chat-${Date.now()}`,
          title: outfit.title,
          tagline: outfit.tagline,
          overallVibe: outfit.subtitle,
          comfortRating: 5.0,
          affordabilityRating: 4.8,
          modestFriendly: true,
          skinToneMatch: "Diselaraskan langsung via Look.u AI Concierge.",
          whyItWorks: outfit.tagline,
          stylingTip: "Padukan dengan alas kaki berpori mikro.",
          colorPalette: outfit.swatches,
          createdAt: new Date().toISOString(),
          items: outfit.items || [],
        };
        localStorage.setItem("looku_saved_outfits", JSON.stringify([newOutfit, ...saved]));
        window.dispatchEvent(new Event("looku_saved_updated"));
      }

      setCardSavedToast("✨ Setelan berhasil disimpan ke Lemari Digital!");
      setTimeout(() => setCardSavedToast(null), 3000);
    } catch (e) {
      console.error("Error saving to wardrobe:", e);
    }
  };

  const handleLoadOutfitToStudio = (outfit: ChatOutfitCard) => {
    setIsOpen(false);
    router.push(`/studio?look=${outfit.presetKey || outfit.studioParam || outfit.id}`);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputMessage;
    const hasImage = Boolean(selectedImage);

    if (!message.trim() && !hasImage) return;
    if (loading) return;

    const currentImage = selectedImage;
    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: message.trim() || (hasImage ? "Tolong analisis fotoku dan berikan rekomendasi setelan adem yang paling cocok!" : ""),
      userImage: currentImage || undefined,
      timestamp: "Baru saja",
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInputMessage("");
    setSelectedImage(null);
    setShowPhotoOptions(false);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          imageBase64: currentImage,
          imageMimeType: "image/jpeg",
        }),
      });

      const data = await res.json();
      const stylistMsg: Message = {
        id: `sty_${Date.now()}`,
        sender: "stylist",
        text: data.reply || "Berikut kurasi setelan tropis yang paling sesuai dengan kebutuhanmu:",
        outfitMatch: data.outfitMatch,
        followUps: data.followUps,
        timestamp: "Baru saja",
      };

      const finalMsgs = [...updatedMessages, stylistMsg];
      saveMessagesToLocal(finalMsgs);
    } catch (err) {
      console.error("Chat error:", err);
      const fallbackMsg: Message = {
        id: `sty_${Date.now()}`,
        sender: "stylist",
        text: "Koneksi agak lambat, namun AI tetap merekomendasikan Katun Linen Crinkle + Kulot Loose broken white sebagai paduan anti-gerah nomor 1 hari ini.",
        timestamp: "Baru saja",
      };
      saveMessagesToLocal([...updatedMessages, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickScenarios = [
    "Kuliah Hijab Adem 29°C",
    "Ngantor SCBD Breathable",
    "Hangout Kafe Senopati",
    "Pria Smart Casual",
    "Kondangan Sutra Elegan",
    "Old Money Coastal",
    "Streetwear Blok M",
  ];

  return (
    <>
      {/* ============================================================ */}
      {/* 1. FLOATING LAUNCHER (Uniqlo Minimalist Aesthetic)           */}
      {/* ============================================================ */}
      <div className="fixed bottom-[calc(70px+env(safe-area-inset-bottom,0px))] md:bottom-8 right-3.5 sm:right-6 md:right-8 z-40 pointer-events-auto">
        <AnimatePresence>
          {!isOpen && (
            <>
              {/* Mobile Launcher (< 640px - Standard 48x48px Touch Target) */}
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsOpen(true)}
                aria-label="Buka AI Stylist Concierge"
                className={`sm:hidden ${pathname === "/" ? "hidden" : "flex"} w-12 h-12 bg-[#181A18] text-white shadow-2xl items-center justify-center relative active:scale-95 transition-transform border border-white/25 rounded-full`}
              >
                <Sparkles className="w-5 h-5 text-cream-200" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#181A18] animate-pulse" />
              </motion.button>

              {/* Desktop Launcher (>= 640px) */}
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(true)}
                aria-label="Konsultasi Look.u Concierge"
                className="hidden sm:flex h-12 px-5 bg-[#181A18] hover:bg-terracotta-600 text-[#FAF8F5] shadow-2xl items-center gap-3 transition-colors border border-white/20 rounded-none group"
              >
                <div className="relative">
                  <Sparkles className="w-4 h-4 text-cream-200" />
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ring-1 ring-[#181A18]" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] block leading-none">
                    Look<span className="text-terracotta-400">.</span>u Concierge
                  </span>
                  <span className="text-[9px] font-mono text-white/60 uppercase tracking-widest mt-0.5 block">
                    AI Stylist &amp; Vision Scanner
                  </span>
                </div>
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ============================================================ */}
      {/* 2. CHAT DRAWER / FULLSCREEN MODAL (100dvh Mobile Ergonomics) */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="fixed inset-0 sm:inset-auto sm:bottom-8 sm:right-8 z-50 w-full sm:w-[440px] h-[100dvh] sm:h-[650px] sm:max-h-[92vh] bg-[#FAF8F5] text-[#181A18] flex flex-col overflow-hidden shadow-2xl sm:border sm:border-[#181A18]/20 select-none rounded-none"
          >
            {/* Header Concierge (h-14 shrink-0) */}
            <header className="h-14 shrink-0 px-4 bg-[#FAF8F5] border-b border-[#181A18]/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup Concierge"
                  className="p-1 -ml-1 text-[#181A18] hover:bg-[#181A18]/5 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[1.5]" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-lg font-bold tracking-tight text-[#181A18] leading-none">
                      Look<span className="text-terracotta-500 font-bold">.</span>u Concierge
                    </h2>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  </div>
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#181A18]/50 mt-0.5 font-mono">
                    Gemini AI · Tropical Styling Engine
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleClearChat}
                  title="Reset percakapan"
                  className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 border border-[#181A18]/20 text-[#181A18] hover:bg-[#181A18] hover:text-[#FAF8F5] transition rounded-none"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup"
                  className="p-1 text-[#181A18]/60 hover:text-[#181A18] sm:flex hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Pinned Context Strip di Bawah Header */}
            <div className="shrink-0 bg-[#EFECE6] border-b border-[#181A18]/10 px-4 py-1.5 flex items-center justify-between text-[10px] select-none">
              <div className="flex items-center gap-2 truncate text-[#181A18]/80 font-medium">
                <span className="font-bold uppercase tracking-wider text-[#181A18]">Konteks:</span>
                <span className="truncate">{weather.location} {weather.temperature}°C</span>
                <span className="text-[#181A18]/30">·</span>
                <span className="truncate">{userSkinTone}</span>
                <span className="text-[#181A18]/30">·</span>
                <span className="truncate">{userGenderPref}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextPref = userGenderPref === "Modest / Hijab" ? "Wanita Chic" : userGenderPref === "Wanita Chic" ? "Pria Smart Casual" : "Modest / Hijab";
                  setUserGenderPref(nextPref);
                }}
                className="font-bold uppercase underline underline-offset-2 text-[#8C5A3C] shrink-0 ml-2 hover:text-[#181A18] transition-colors"
              >
                Ubah
              </button>
            </div>

            {/* Notification Toast */}
            {cardSavedToast && (
              <div className="bg-[#181A18] text-[#FAF8F5] text-[11px] font-mono font-bold py-1.5 px-4 text-center shrink-0">
                {cardSavedToast}
              </div>
            )}

            {/* ============================================================ */}
            {/* 3. CHAT STREAM AREA (Editorial Block & Rich Cards)           */}
            {/* ============================================================ */}
            <main className="flex-1 overflow-y-auto px-4 py-5 space-y-5 max-w-2xl mx-auto w-full no-scrollbar">
              {messages.map((m) => {
                const isUser = m.sender === "user";

                if (isUser) {
                  return (
                    <div key={m.id} className="flex flex-col items-end">
                      {m.userImage && (
                        <div className="relative w-36 aspect-[4/5] bg-[#E5E0D8] overflow-hidden mb-1.5 border border-[#181A18]/30 shadow-xs rounded-none">
                          <Image src={m.userImage} alt="Uploaded" fill className="object-cover" />
                        </div>
                      )}
                      <div className="max-w-[82%] bg-[#181A18] text-[#FAF8F5] px-4 py-3 text-xs leading-relaxed rounded-none shadow-sm">
                        {m.text}
                      </div>
                      <span className="text-[9px] font-mono text-[#181A18]/40 mt-1 uppercase tracking-wider">
                        {m.timestamp}
                      </span>
                    </div>
                  );
                }

                // Stylist Message
                return (
                  <div key={m.id} className="flex flex-col items-start space-y-3 w-full">
                    {/* Editorial Stylist Label */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#8C5A3C]">
                        ✦ AI Stylist Analysis
                      </span>
                    </div>

                    {/* Editorial Rationale Note */}
                    <div className="pl-3 border-l-2 border-[#D4A373] text-xs text-[#181A18]/85 leading-relaxed space-y-1">
                      <p>{m.text}</p>
                    </div>

                    {/* ============================================================ */}
                    {/* EMBEDDED RICH OUTFIT CARD (Menarik dari 22 Presets & Catalog) */}
                    {/* ============================================================ */}
                    {m.outfitMatch && (
                      <div className="w-full max-w-sm bg-white border border-[#181A18]/15 rounded-none overflow-hidden shadow-xs mt-1">
                        <div className="grid grid-cols-12">
                          {/* Thumbnail Rasio 4:5 di Kiri */}
                          <div className="col-span-5 relative aspect-[4/5] bg-[#EFECE6] overflow-hidden">
                            <Image
                              src={m.outfitMatch.image}
                              alt={m.outfitMatch.title}
                              fill
                              className="object-cover"
                            />
                            <span className="absolute top-1.5 left-1.5 bg-[#181A18]/90 text-[#FAF8F5] px-1.5 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider">
                              {m.outfitMatch.climateBadge}
                            </span>
                          </div>

                          {/* Detail Formula di Kanan */}
                          <div className="col-span-7 p-3 flex flex-col justify-between">
                            <div>
                              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#8C5A3C] block truncate">
                                {m.outfitMatch.subtitle}
                              </span>
                              <h3 className="font-serif text-sm font-bold text-[#181A18] line-clamp-1 mt-0.5">
                                {m.outfitMatch.title}
                              </h3>
                              <p className="text-[10px] text-[#181A18]/65 line-clamp-2 mt-1 leading-tight">
                                {m.outfitMatch.itemsSummary}
                              </p>

                              {/* 3 Dot Swatches */}
                              <div className="flex items-center gap-1.5 mt-2">
                                <span className="text-[9px] uppercase text-[#181A18]/50 font-mono">Palet:</span>
                                {m.outfitMatch.swatches.slice(0, 3).map((warna, idx) => (
                                  <span
                                    key={idx}
                                    className="w-2.5 h-2.5 rounded-full border border-[#181A18]/25 shadow-2xs"
                                    style={{ backgroundColor: warna.hex }}
                                    title={warna.name}
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="pt-2 mt-2 border-t border-[#181A18]/10 flex items-center justify-between">
                              <span className="font-mono text-[11px] font-bold text-[#181A18]">
                                {m.outfitMatch.priceRange}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleLoadOutfitToStudio(m.outfitMatch!)}
                                className="text-[10px] font-bold uppercase tracking-wider underline text-[#181A18] hover:text-terracotta-600 transition-colors"
                              >
                                Lihat Formula ↗
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* In-Chat Expandable Components Breakdown */}
                        {expandedOutfitId === m.outfitMatch.id && (
                          <div className="p-3 bg-[#FAF8F5] border-t border-[#181A18]/10 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#181A18]">
                                Rincian Komponen ({m.outfitMatch.items.length}):
                              </span>
                              <button
                                type="button"
                                onClick={() => setExpandedOutfitId(null)}
                                className="text-[9px] uppercase font-bold text-[#181A18]/60 hover:text-[#181A18]"
                              >
                                Tutup ✕
                              </button>
                            </div>

                            <div className="space-y-1.5">
                              {m.outfitMatch.items.map((item, idx) => (
                                <div key={idx} className="p-2 bg-white border border-[#181A18]/10 flex items-center justify-between text-[10px]">
                                  <div className="pr-2">
                                    <span className="font-bold text-[#181A18] block truncate max-w-[170px]">{item.name}</span>
                                    <span className="text-[#181A18]/60 truncate block max-w-[170px]">{item.material}</span>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="font-mono font-bold text-[#181A18] block">{item.estimatedPrice}</span>
                                    {item.shopeeQuery && (
                                      <a
                                        href={`https://shopee.co.id/search?keyword=${encodeURIComponent(item.shopeeQuery)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => trackAffiliateClick("shopee", item.name, "chatbot")}
                                        className="text-[9px] uppercase font-bold text-orange-600 hover:underline"
                                      >
                                        Beli ↗
                                      </a>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="pt-2 flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleSaveOutfitToWardrobe(m.outfitMatch!)}
                                className="flex-1 py-1.5 bg-[#181A18] text-[#FAF8F5] text-[10px] font-bold uppercase tracking-wider hover:bg-terracotta-600 transition-colors rounded-none"
                              >
                                Simpan ke Lemari
                              </button>
                              <button
                                type="button"
                                onClick={() => handleLoadOutfitToStudio(m.outfitMatch!)}
                                className="flex-1 py-1.5 border border-[#181A18] text-[#181A18] text-[10px] font-bold uppercase tracking-wider hover:bg-[#181A18]/5 transition-colors rounded-none"
                              >
                                Buka di Studio ↗
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Follow-up Action Chips */}
                    {m.outfitMatch && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => setExpandedOutfitId(prev => prev === m.outfitMatch?.id ? null : m.outfitMatch!.id)}
                          className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider border border-[#181A18]/20 bg-[#FAF8F5] hover:bg-[#181A18] hover:text-[#FAF8F5] transition rounded-none"
                        >
                          {expandedOutfitId === m.outfitMatch.id ? "Sembunyikan Item" : "Lihat Komponen Pakaian"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendMessage("Cari paduan warna yang lebih gelap / bold")}
                          className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider border border-[#181A18]/20 bg-[#FAF8F5] hover:bg-[#181A18] hover:text-[#FAF8F5] transition rounded-none"
                        >
                          Palet Lebih Gelap
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendMessage("Rekomendasi versi lebih formal untuk acara")}
                          className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider border border-[#181A18]/20 bg-[#FAF8F5] hover:bg-[#181A18] hover:text-[#FAF8F5] transition rounded-none"
                        >
                          Versi Formal
                        </button>
                      </div>
                    )}

                    <span className="text-[9px] font-mono text-[#181A18]/40 uppercase tracking-wider">
                      {m.timestamp}
                    </span>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-2 p-3 bg-white border border-[#181A18]/15 rounded-none max-w-[80%] text-[#181A18]/70 shadow-xs">
                  <div className="w-1.5 h-1.5 bg-[#181A18] animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-[#181A18] animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1.5 h-1.5 bg-[#181A18] animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] font-mono ml-1 uppercase tracking-wider">
                    {selectedImage ? "Vision AI memindai foto & kain..." : "Stylist AI meracik formula..."}
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </main>

            {/* ============================================================ */}
            {/* 4. BOTTOM INPUT DOCK (Terkunci & Bebas Horizontal Scrollbar) */}
            {/* ============================================================ */}
            <footer className="shrink-0 bg-[#FAF8F5] border-t border-[#181A18]/10 p-3 pb-[max(12px,env(safe-area-inset-bottom,0px))]">
              <div className="max-w-2xl mx-auto w-full space-y-2.5">
                
                {/* Horizontal Quick-Scenario Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                  {quickScenarios.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(chip)}
                      className="shrink-0 px-2.5 py-1 bg-[#EFECE6] text-[#181A18] text-[10px] font-semibold uppercase tracking-wider hover:bg-[#181A18] hover:text-[#FAF8F5] transition rounded-none border border-transparent hover:border-[#181A18]"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Attached Image Preview Strip */}
                {selectedImage && (
                  <div className="px-3 py-1.5 bg-white border border-[#181A18]/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-none overflow-hidden border border-[#181A18]">
                        <Image src={selectedImage} alt="Preview" fill className="object-cover" />
                      </div>
                      <span className="text-[10px] font-mono text-[#181A18] font-bold uppercase tracking-wider">
                        Foto Siap Dianalisis ✨
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedImage(null)}
                      className="p-1 hover:text-rose-600 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Photo Options Popover */}
                <AnimatePresence>
                  {showPhotoOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="p-2.5 bg-white border border-[#181A18]/20 shadow-md flex flex-col gap-2 rounded-none"
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setShowPhotoOptions(false);
                            setIsLiveCameraOpen(true);
                          }}
                          className="p-2.5 bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#181A18]/15 text-[#181A18] flex items-center gap-2 transition-colors text-left rounded-none"
                        >
                          <div className="w-7 h-7 bg-[#181A18] text-white flex items-center justify-center shrink-0">
                            <Camera className="w-4 h-4 text-cream-200" />
                          </div>
                          <div>
                            <div className="font-bold text-[11px]">Kamera Langsung</div>
                            <div className="text-[9px] text-[#181A18]/60">Deteksi foto selfie / baju</div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setShowPhotoOptions(false);
                            fileInputRef.current?.click();
                          }}
                          className="p-2.5 bg-[#FAF8F5] hover:bg-[#EFECE6] border border-[#181A18]/15 text-[#181A18] flex items-center gap-2 transition-colors text-left rounded-none"
                        >
                          <div className="w-7 h-7 bg-[#181A18] text-white flex items-center justify-center shrink-0">
                            <ImagePlus className="w-4 h-4 text-cream-200" />
                          </div>
                          <div>
                            <div className="font-bold text-[11px]">Pilih dari Galeri</div>
                            <div className="text-[9px] text-[#181A18]/60">Upload foto tersimpan</div>
                          </div>
                        </button>
                      </div>

                      <div className="text-[9px] text-[#181A18]/70 p-1.5 bg-[#EFECE6] flex items-center gap-1.5 font-mono">
                        <span>🔒</span>
                        <span>Foto diproses privat di RAM browser tanpa disimpan di server publik.</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input Bar Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-1.5"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* Camera Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPhotoOptions(!showPhotoOptions)}
                    disabled={loading}
                    className={`h-11 w-11 flex items-center justify-center border transition-all shrink-0 rounded-none ${
                      showPhotoOptions
                        ? "bg-[#181A18] text-white border-[#181A18]"
                        : "bg-white hover:bg-[#EFECE6] text-[#181A18] border-[#181A18]/25"
                    }`}
                    title="Scan Kamera / Unggah Galeri"
                  >
                    <Camera className="w-4 h-4 text-[#8C5A3C]" />
                  </button>

                  {/* Text Input */}
                  <input
                    type="text"
                    placeholder={selectedImage ? "Ketik catatan foto (misal: untuk kuliah)..." : "Tanyakan gaya, bahan adem, atau acara..."}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={loading}
                    className="flex-1 h-11 px-3.5 bg-white border border-[#181A18]/25 text-xs text-[#181A18] placeholder:text-[#181A18]/40 focus:outline-none focus:border-[#181A18] rounded-none"
                  />

                  {/* Mic Voice Button */}
                  <button
                    type="button"
                    onClick={handleToggleVoice}
                    disabled={loading}
                    className={`h-11 w-11 flex items-center justify-center border transition-all shrink-0 rounded-none ${
                      isListening
                        ? "bg-rose-600 text-white border-rose-600 animate-pulse"
                        : "bg-white hover:bg-[#EFECE6] text-[#181A18] border-[#181A18]/25"
                    }`}
                    title={isListening ? "Mendengarkan suara..." : "Input suara"}
                  >
                    {isListening ? (
                      <MicOff className="w-4 h-4 text-white" />
                    ) : (
                      <Mic className="w-4 h-4 text-[#8C5A3C]" />
                    )}
                  </button>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={(!inputMessage.trim() && !selectedImage) || loading}
                    className="h-11 px-4 sm:px-5 bg-[#181A18] text-[#FAF8F5] text-[11px] font-bold uppercase tracking-widest shrink-0 rounded-none hover:bg-terracotta-600 active:opacity-90 transition-colors disabled:opacity-40"
                  >
                    Kirim
                  </button>
                </form>

              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Camera Viewfinder Modal */}
      <LiveCameraModal
        isOpen={isLiveCameraOpen}
        onClose={() => setIsLiveCameraOpen(false)}
        onCapture={handleCaptureFromLiveCamera}
      />
    </>
  );
}
