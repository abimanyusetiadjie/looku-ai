"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Sparkles, X, Send, Camera, ArrowUpRight, ShoppingBag, ImagePlus, Video, Mic, MicOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LiveCameraModal from "./LiveCameraModal";
import { OOTDRecommendation } from "@/lib/types";
import { trackAffiliateClick } from "@/lib/affiliate";

interface VisualCard {
  title: string;
  topName: string;
  topImg: string;
  topPrice: string;
  bottomName: string;
  bottomImg: string;
  bottomPrice: string;
  shopeeUrl: string;
  tokpedUrl: string;
}

interface Message {
  id: string;
  sender: "user" | "stylist";
  text: string;
  userImage?: string;
  visualCard?: VisualCard;
  timestamp: string;
}

const DEFAULT_WELCOME_MSG: Message = {
  id: "msg_welcome",
  sender: "stylist",
  text: "Halo kak! Aku Stylist Pribadi look.u.\n\nTanyakan apa pun seputar padu-padan OOTD, atau klik ikon kamera untuk deteksi undertone warna kulit langsung dari foto!\n\n🔒 Privasi Terjamin: Foto dianalisis langsung di RAM browser dan otomatis dihapus seketika.",
  timestamp: "Baru saja",
};

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [cardSavedToast, setCardSavedToast] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleToggleVoice = () => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser Anda belum mendukung input suara. Gunakan browser Google Chrome / Edge untuk fitur ini.");
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

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setIsListening(false);
    }
  };

  const [messages, setMessages] = useState<Message[]>([DEFAULT_WELCOME_MSG]);

  // Load chat messages from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("looku_chat_messages");
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
        localStorage.setItem("looku_chat_messages", JSON.stringify(newMsgs));
      } catch (e) {
        console.error("Error saving chat storage:", e);
      }
    }
  };

  const handleClearChat = () => {
    if (confirm("Hapus seluruh percakapan chat?")) {
      saveMessagesToLocal([DEFAULT_WELCOME_MSG]);
    }
  };

  const handleSaveCardToWardrobe = (card: VisualCard) => {
    if (typeof window === "undefined") return;
    try {
      const saved = JSON.parse(localStorage.getItem("looku_saved_outfits") || "[]");
      const newOutfit: OOTDRecommendation = {
        id: `chat-outfit-${Date.now()}`,
        title: `✦ Stylist Pick: ${card.title}`,
        tagline: `${card.topName} + ${card.bottomName}`,
        overallVibe: "Stylist Chat Curated",
        comfortRating: 5,
        affordabilityRating: 5,
        modestFriendly: true,
        skinToneMatch: "Rekomendasi instan langsung dari AI Stylist look.u",
        whyItWorks: "Kombinasi atasan dan bawahan seimbang untuk mobilitas aktif tropis.",
        stylingTip: "Gunakan alas kaki minimalis warna netral.",
        colorPalette: [
          { name: "Charcoal", hex: "#181A18" },
          { name: "Sage", hex: "#9CA986" },
          { name: "Sand", hex: "#FAF8F5" },
        ],
        createdAt: new Date().toISOString(),
        items: [
          {
            name: card.topName,
            category: "atasan",
            color: "Stylist Pick",
            material: "Katun Adem",
            estimatedPrice: card.topPrice,
            shopeeQuery: card.shopeeUrl,
            tokopediaQuery: card.tokpedUrl,
          },
          {
            name: card.bottomName,
            category: "bawahan",
            color: "Stylist Pick",
            material: "Linen / Twill",
            estimatedPrice: card.bottomPrice,
            shopeeQuery: card.shopeeUrl,
            tokopediaQuery: card.tokpedUrl,
          },
        ],
      };

      localStorage.setItem("looku_saved_outfits", JSON.stringify([newOutfit, ...saved]));
      window.dispatchEvent(new Event("looku_saved_updated"));
      setCardSavedToast("Setelan Disimpan ke Lemari!");
      setTimeout(() => setCardSavedToast(null), 3000);
    } catch (e) {
      console.error("Error saving card to wardrobe:", e);
    }
  };

  const handleLoadCardToStudio = (card: VisualCard) => {
    if (typeof window === "undefined") return;
    const newOutfit: OOTDRecommendation = {
      id: `chat-studio-${Date.now()}`,
      title: `✦ Stylist Pick: ${card.title}`,
      tagline: `${card.topName} + ${card.bottomName}`,
      overallVibe: "Stylist Chat Curated",
      comfortRating: 5,
      affordabilityRating: 5,
      modestFriendly: true,
      skinToneMatch: "Rekomendasi personal langsung dari AI Stylist look.u",
      whyItWorks: "Kombinasi atasan dan bawahan seimbang untuk mobilitas aktif tropis.",
      stylingTip: "Gunakan alas kaki minimalis warna netral.",
      colorPalette: [
        { name: "Charcoal", hex: "#181A18" },
        { name: "Sage", hex: "#9CA986" },
        { name: "Sand", hex: "#FAF8F5" },
      ],
      createdAt: new Date().toISOString(),
      items: [
        {
          name: card.topName,
          category: "atasan",
          color: "Stylist Pick",
          material: "Katun Adem",
          estimatedPrice: card.topPrice,
          shopeeQuery: card.shopeeUrl,
          tokopediaQuery: card.tokpedUrl,
        },
        {
          name: card.bottomName,
          category: "bawahan",
          color: "Stylist Pick",
          material: "Linen / Twill",
          estimatedPrice: card.bottomPrice,
          shopeeQuery: card.shopeeUrl,
          tokopediaQuery: card.tokpedUrl,
        },
      ],
    };

    window.dispatchEvent(new CustomEvent("looku_load_outfit_to_studio", { detail: newOutfit }));
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
    const studioEl = document.getElementById("hasil-ootd") || document.getElementById("studio");
    studioEl?.scrollIntoView({ behavior: "smooth" });
  };

  const quickQuestions = [
    "Foto kamera & analisa undertone",
    "Baju wisuda outdoor 34°C yang adem",
    "Warna glowing untuk Sawo Matang",
    "Outfit kondangan hijab modern",
    "Mix & match kemeja linen sage",
    "Rekomendasi blazer kulot flowy",
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Client-side image compression to <300KB
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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

  const handleSendMessage = async (textToSend?: string) => {
    const message = textToSend || inputMessage;
    const hasImage = !!selectedImage;

    if (!message.trim() && !hasImage) return;
    if (loading) return;

    const currentImage = selectedImage;
    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: message.trim() || (hasImage ? "Tolong analisis fotoku dan rekomendasikan baju + celana yang cocok ya!" : ""),
      userImage: currentImage || undefined,
      timestamp: "Baru saja",
    };

    setMessages((prev) => [...prev, userMsg]);
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
          history: messages.map((m) => ({
            role: m.sender === "stylist" ? "assistant" : "user",
            text: m.text,
          })),
        }),
      });

      const data = await res.json();
      const stylistMsg: Message = {
        id: `sty_${Date.now()}`,
        sender: "stylist",
        text: data.reply || "Ada yang bisa aku bantu lagi seputar outfitmu kak?",
        visualCard: data.visualCard,
        timestamp: "Baru saja",
      };

      setMessages((prev) => [...prev, stylistMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `sty_${Date.now()}`,
          sender: "stylist",
          text: "Koneksi agak lambat atau server sibuk. AI tetap merekomendasikan formula dasar: Katun Rayon Sage + Linen Pants. Klik 'Coba Ulang' di bawah!",
          timestamp: "Baru saja",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-[calc(66px+env(safe-area-inset-bottom,0px))] md:bottom-8 right-3 sm:right-6 md:right-8 z-30 pointer-events-auto">
        <AnimatePresence>
          {!isOpen && (
            <>
              {/* Mobile Circular FAB (<640px) */}
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setIsOpen(true)}
                aria-label="Tanya AI Stylist"
                className="sm:hidden w-12 h-12 rounded-full bg-[#181A18] text-white shadow-2xl border-2 border-white/20 flex items-center justify-center relative shadow-glow"
              >
                <Sparkles className="w-5 h-5 text-terracotta-400" />
                <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#181A18] animate-pulse" />
              </motion.button>

              {/* Desktop Expanded Pill (>=640px) */}
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                aria-label="Tanya Stylist"
                className="hidden sm:flex py-3 px-5 rounded-full bg-[#181A18] hover:bg-terracotta-500 text-white shadow-2xl border border-white/15 items-center gap-2.5 transition-all group"
              >
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-terracotta-400 group-hover:text-white transition-colors">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse border border-[#181A18]" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold tracking-tight text-[#FAF8F5] flex items-baseline">
                    Tanya Stylist <span className="font-serif italic ml-1">look<span className="text-terracotta-500 not-italic">.</span>u</span>
                  </div>
                  <div className="text-[9px] font-mono text-[#A89582] group-hover:text-white/80 uppercase">
                    Kamera & Scan Foto AI
                  </div>
                </div>
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Chat Drawer Window (Mobile Bottom-Sheet / Desktop Popup) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.96 }}
            transition={{ type: "spring", damping: 26, stiffness: 280 }}
            className="fixed inset-x-0 bottom-0 sm:bottom-8 sm:right-8 sm:left-auto z-50 w-full sm:w-[420px] h-[88dvh] sm:h-[580px] bg-[#FAF8F5] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#D7CABC] flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom,0px)]"
          >
            {/* Mobile Pull Handle Indicator */}
            <div className="sm:hidden w-full flex justify-center pt-2.5 pb-1 bg-[#181A18]">
              <div className="w-10 h-1 rounded-full bg-white/30" />
            </div>
            {/* Chat Header */}
            <div className="p-4 bg-[#181A18] text-[#FAF8F5] flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full bg-terracotta-500 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-[#181A18]" />
                </div>
                <div>
                  <div className="font-serif font-bold text-sm text-white flex items-baseline">
                    Stylist Pribadi <span className="italic ml-1">look<span className="text-terracotta-400 not-italic">.</span>u</span>
                  </div>
                  <div className="text-[9px] font-mono text-[#D7CABC] uppercase tracking-wider">
                    Online • Kamera & Vision AI
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {messages.length > 1 && (
                  <button
                    onClick={handleClearChat}
                    className="text-[10px] font-mono text-white/60 hover:text-rose-400 px-2 py-1 rounded transition-colors uppercase font-bold"
                    title="Hapus riwayat obrolan"
                  >
                    Hapus Chat
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full text-[#A89582] hover:text-white hover:bg-white/10 transition-colors"
                  title="Tutup Obrolan"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Toast feedback */}
            {cardSavedToast && (
              <div className="bg-emerald-600 text-white text-[11px] font-bold py-1.5 px-4 text-center">
                {cardSavedToast}
              </div>
            )}

            {/* Chat Messages List */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {messages.map((m) => {
                const isUser = m.sender === "user";
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    {/* User Uploaded Image Preview in bubble */}
                    {m.userImage && (
                      <div className="relative w-36 h-48 rounded-2xl overflow-hidden mb-1.5 border-2 border-[#181A18] shadow-md">
                        <Image
                          src={m.userImage}
                          alt="Uploaded by user"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {/* Message Bubble Text */}
                    {m.text && (
                      <div
                        className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                          isUser
                            ? "bg-[#181A18] text-[#FAF8F5] rounded-br-none shadow-sm"
                            : "bg-white text-[#181A18] border border-[#E8DFD1] rounded-bl-none shadow-sm"
                        }`}
                      >
                        {m.text}
                      </div>
                    )}

                    {/* Rich Visual Recommendation Card from Stylist (Top + Bottom) */}
                    {m.visualCard && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="mt-2 w-full max-w-[92%] bg-white rounded-2xl p-3.5 border border-[#D7CABC] shadow-md space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-[#E8DFD1] pb-2">
                          <div className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase text-terracotta-600">
                            <ShoppingBag className="w-3 h-3" />
                            <span>{m.visualCard.title}</span>
                          </div>
                          <span className="text-[9px] font-mono text-[#A89582] uppercase">
                            MATCHED
                          </span>
                        </div>

                        {/* Top & Bottom Side-by-Side Visuals */}
                        <div className="grid grid-cols-2 gap-2">
                          {/* Top Item */}
                          <div className="bg-[#FAF8F5] rounded-xl p-2 border border-[#E8DFD1] space-y-1.5">
                            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#E8DFD1]">
                              <Image
                                src={m.visualCard.topImg}
                                alt={m.visualCard.topName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="text-[8px] font-mono text-[#A89582] uppercase">ATASAN</div>
                              <div className="font-bold text-[10px] text-[#181A18] line-clamp-1">
                                {m.visualCard.topName}
                              </div>
                              <div className="text-[9px] font-mono text-terracotta-600 font-bold">
                                {m.visualCard.topPrice}
                              </div>
                            </div>
                          </div>

                          {/* Bottom Item */}
                          <div className="bg-[#FAF8F5] rounded-xl p-2 border border-[#E8DFD1] space-y-1.5">
                            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-[#E8DFD1]">
                              <Image
                                src={m.visualCard.bottomImg}
                                alt={m.visualCard.bottomName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="text-[8px] font-mono text-[#A89582] uppercase">BAWAHAN</div>
                              <div className="font-bold text-[10px] text-[#181A18] line-clamp-1">
                                {m.visualCard.bottomName}
                              </div>
                              <div className="text-[9px] font-mono text-terracotta-600 font-bold">
                                {m.visualCard.bottomPrice}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Load to Studio & Save to Wardrobe Actions */}
                        <div className="space-y-1.5 pt-1">
                          <button
                            onClick={() => handleLoadCardToStudio(m.visualCard!)}
                            className="w-full py-2 px-3 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>Tampilkan di Studio OOTD</span>
                          </button>

                          <button
                            onClick={() => handleSaveCardToWardrobe(m.visualCard!)}
                            className="w-full py-1.5 px-3 rounded-xl bg-sand-100 hover:bg-sand-200 text-charcoal-900 font-bold text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border border-sand-300 shadow-2xs"
                          >
                            <span>Simpan Setelan ke Lemari</span>
                          </button>
                        </div>

                        {/* Shop Actions */}
                        <div className="flex items-center gap-2 pt-1">
                          <a
                            href={m.visualCard.shopeeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackAffiliateClick("shopee", m.visualCard?.topName || "Chatbot Recommendation", "chatbot")}
                            className="flex-1 py-2 rounded-xl bg-white hover:bg-orange-500 hover:text-white border border-[#D7CABC] hover:border-orange-500 text-center font-bold text-[10px] uppercase transition-all flex items-center justify-center gap-1 shadow-2xs"
                          >
                            <span>Shopee</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                          <a
                            href={m.visualCard.tokpedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackAffiliateClick("tokopedia", m.visualCard?.topName || "Chatbot Recommendation", "chatbot")}
                            className="flex-1 py-2 rounded-xl bg-white hover:bg-emerald-600 hover:text-white border border-[#D7CABC] hover:border-emerald-600 text-center font-bold text-[10px] uppercase transition-all flex items-center justify-center gap-1 shadow-2xs"
                          >
                            <span>Tokopedia</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </a>
                        </div>
                      </motion.div>
                    )}

                    <span className="text-[9px] font-mono text-[#A89582] mt-1 px-1">
                      {m.timestamp}
                    </span>
                  </div>
                );
              })}

              {loading && (
                <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-[#E8DFD1] max-w-[80%] text-[#181A18]/70 shadow-xs">
                  <div className="w-2 h-2 rounded-full bg-terracotta-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-terracotta-500 animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-terracotta-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] font-mono ml-1">
                    {selectedImage ? "Menganalisis foto & warna kulit..." : "Stylist sedang mengetik..."}
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-3 py-2 bg-[#F4EFE6] border-t border-[#E8DFD1] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    if (q.toLowerCase().includes("foto kamera") || q.toLowerCase().includes("foto selfie")) {
                      setIsLiveCameraOpen(true);
                    } else {
                      handleSendMessage(q);
                    }
                  }}
                  className="px-3 py-1.5 rounded-full bg-white border border-[#D7CABC] hover:border-[#181A18] text-[11px] text-[#181A18] font-medium whitespace-nowrap shrink-0 transition-all shadow-2xs"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Attached Image Preview Chip before sending */}
            {selectedImage && (
              <div className="px-3 py-1.5 bg-[#FAF8F5] border-t border-[#E8DFD1] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-[#181A18]">
                    <Image src={selectedImage} alt="Preview" fill className="object-cover" />
                  </div>
                  <span className="text-[10px] font-mono text-[#181A18] font-bold">
                    Foto Siap Dipindai ✨
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="p-1 rounded-full hover:bg-rose-100 text-rose-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Photo Selection Mini Popover Menu */}
            <AnimatePresence>
              {showPhotoOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="p-2.5 bg-white border-t border-[#E8DFD1] shadow-md flex flex-col gap-2"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {/* Option 1: Live Camera Modal */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowPhotoOptions(false);
                        setIsLiveCameraOpen(true);
                      }}
                      className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#E8DFD1] text-[#181A18] flex items-center gap-2 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-lg bg-terracotta-500 text-white flex items-center justify-center shrink-0">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[11px]">Kamera Langsung</div>
                        <div className="text-[9px] text-[#A89582]">Jepret selfie / baju</div>
                      </div>
                    </button>

                    {/* Option 2: Gallery Picker */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowPhotoOptions(false);
                        fileInputRef.current?.click();
                      }}
                      className="p-2.5 rounded-xl bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#E8DFD1] text-[#181A18] flex items-center gap-2 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-lg bg-[#181A18] text-white flex items-center justify-center shrink-0">
                        <ImagePlus className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-[11px]">Pilih dari Galeri</div>
                        <div className="text-[9px] text-[#A89582]">Upload foto tersimpan</div>
                      </div>
                    </button>
                  </div>
                  
                  <div className="mt-1 flex flex-col gap-1.5 p-2 bg-[#F4EFE6] rounded-lg border border-[#E8DFD1]">
                    <div className="text-[10px] text-[#181A18] flex items-start gap-1.5">
                      <span className="text-[12px]">👔</span>
                      <span>Foto Baju Saja (Flatlay / Gantungan) — tidak wajib foto badan.</span>
                    </div>
                    <div className="text-[10px] text-[#181A18]/80 flex items-start gap-1.5 border-t border-[#D7CABC] pt-1.5">
                      <span className="text-[12px]">🔒</span>
                      <span>Foto diproses privat oleh AI dan langsung dihapus. Tidak disimpan di server publik.</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-[#E8DFD1] flex items-center gap-2 shrink-0"
            >
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Photo Options Trigger Button */}
              <button
                type="button"
                onClick={() => setShowPhotoOptions(!showPhotoOptions)}
                disabled={loading}
                className={`p-2.5 rounded-xl border transition-all shrink-0 ${
                  showPhotoOptions
                    ? "bg-[#181A18] text-white border-[#181A18]"
                    : "bg-[#F4EFE6] hover:bg-[#E8DFD1] text-[#181A18] border-[#D7CABC]"
                }`}
                title="Ambil Foto Kamera / Upload Galeri"
              >
                <Camera className="w-4 h-4 text-terracotta-600" />
              </button>

              {/* Text Input */}
              <input
                type="text"
                placeholder={selectedImage ? "Tambahkan pesan (misal: untuk kondangan)..." : "Tanyakan outfit / jepret foto selfie..."}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D7CABC] focus:outline-none focus:border-[#181A18] text-xs text-[#181A18] placeholder-[#A89582]"
              />

              {/* Voice Input Microphone Button */}
              <button
                type="button"
                onClick={handleToggleVoice}
                disabled={loading}
                className={`p-2.5 rounded-xl border transition-all shrink-0 ${
                  isListening
                    ? "bg-rose-600 text-white border-rose-600 animate-pulse shadow-md"
                    : "bg-[#F4EFE6] hover:bg-[#E8DFD1] text-charcoal-900 border-[#D7CABC]"
                }`}
                title={isListening ? "Sedang mendengarkan... Klik untuk berhenti" : "Tanya AI Stylist pakai suara"}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4 text-white" />
                ) : (
                  <Mic className="w-4 h-4 text-terracotta-600" />
                )}
              </button>

              {/* Send Button */}
              <button
                type="submit"
                disabled={(!inputMessage.trim() && !selectedImage) || loading}
                className="p-2.5 rounded-xl bg-[#181A18] hover:bg-terracotta-500 text-white transition-all disabled:opacity-40 shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
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
