import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Upload, Camera, Link as LinkIcon, Sparkles
} from 'lucide-react';
import { OutfitItem, OOTDRecommendation } from '@/lib/types';
import { getMarketplaceLinks, trackAffiliateClick } from '@/lib/affiliate';

interface InfluencerCloneModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onOpenStudio?: (outfitData: any) => void;
  onSelectDupeLook?: (outfitData: any) => void;
}

const PRESETS = [
  { id: 'kr', label: 'Korean Clean Girl', mood: 'Aesthetic Soft', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200' },
  { id: 'scbd', label: 'SCBD Career Chic', mood: 'Smart Blazer', img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=200' },
  { id: 'hijab', label: 'Hijab Minimalist Earthy', mood: 'Sage & Linen', img: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&q=80&w=200' },
  { id: 'oldmoney', label: 'Old Money Casual', mood: 'Camp Linen', img: 'https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&q=80&w=200' },
];

export default function InfluencerCloneModal({ isOpen = true, onClose, onOpenStudio, onSelectDupeLook }: InfluencerCloneModalProps) {
  if (isOpen === false) return null;
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const cameraInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setImage(uploadEvent.target?.result as string);
        simulateAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handlePasteClick = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          if (item.types.some(type => type.startsWith('image/'))) {
            const blob = await item.getType(item.types.find(type => type.startsWith('image/'))!);
            const reader = new FileReader();
            reader.onload = () => {
              setImage(reader.result as string);
              simulateAnalysis();
            };
            reader.readAsDataURL(blob);
            return;
          }
        }
      }
      const url = prompt("Masukkan tautan gambar outfit (URL JPG/PNG/WebP):");
      if (url && url.startsWith("http")) {
        setImage(url);
        simulateAnalysis();
      }
    } catch (err) {
      const url = prompt("Masukkan tautan gambar outfit (URL JPG/PNG/WebP):");
      if (url && url.startsWith("http")) {
        setImage(url);
        simulateAnalysis();
      }
    }
  };

  const handlePreset = (imgUrl: string) => {
    setImage(imgUrl);
    simulateAnalysis();
  };

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setResult(null);
    // Simulate Gemini 2.5 Flash Vision AI processing
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        totalEst: "Rp 175.000 - Rp 230.000",
        saving: "70%",
        items: [
          {
            category: "atasan",
            name: "Oversized Basic Shirt",
            color: "White",
            material: "Katun Poplin",
            estimatedPrice: "Rp 65.000",
            shopeeQuery: "oversized basic shirt katun poplin wanita putih",
            tokopediaQuery: "kemeja putih oversized katun poplin"
          },
          {
            category: "bawahan",
            name: "Highwaist Loose Kulot",
            color: "Nude/Khaki",
            material: "Knit Premium",
            estimatedPrice: "Rp 85.000",
            shopeeQuery: "highwaist loose kulot knit premium khaki nude",
            tokopediaQuery: "kulot knit premium highwaist nude"
          },
          {
            category: "outer_hijab",
            name: "Pashmina Ceruty Babydoll",
            color: "Cream",
            material: "Ceruty Babydoll",
            estimatedPrice: "Rp 25.000",
            shopeeQuery: "pashmina ceruty babydoll cream",
            tokopediaQuery: "pashmina ceruty babydoll cream"
          },
          {
            category: "sepatu",
            name: "Chunky Sneakers",
            color: "White/Beige",
            material: "Sintetis",
            estimatedPrice: "Rp 120.000",
            shopeeQuery: "chunky sneakers wanita putih beige",
            tokopediaQuery: "sneakers chunky wanita putih"
          }
        ] as OutfitItem[]
      });
    }, 1500);
  };

  const handleApplyToStudio = () => {
    const fullOutfit: OOTDRecommendation = {
      id: `clone-${Date.now()}`,
      title: "✦ Selebgram Aesthetic Dupe Look",
      tagline: "Adaptasi Dupe Cerdas dengan Bahan Adem Tropis",
      overallVibe: "Korean Minimalist Casual",
      comfortRating: 5,
      affordabilityRating: 5,
      modestFriendly: true,
      skinToneMatch: "Kombinasi netral earth-tone yang mencerahkan kulit tropis",
      whyItWorks: "Bahan katun poplin & knit flowy yang adem untuk iklim Indonesia.",
      stylingTip: "Padukan dengan tas bahu minimalis.",
      colorPalette: [
        { name: "White", hex: "#FFFFFF" },
        { name: "Mocca", hex: "#D6C0B3" },
        { name: "Sand", hex: "#FAF8F5" },
        { name: "Charcoal", hex: "#181A18" },
      ],
      items: result.items,
      createdAt: new Date().toISOString(),
    };

    if (onSelectDupeLook) onSelectDupeLook(fullOutfit);
    if (onOpenStudio) onOpenStudio(fullOutfit);
    onClose();

    if (typeof window !== "undefined") {
      const el = document.getElementById("studio");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center p-0 sm:p-4 bg-charcoal-900/60 backdrop-blur-sm">
      {/* Hidden Camera Input */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleUpload}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 280 }}
        className="w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-tactile border border-sand-200 overflow-hidden flex flex-col h-[88dvh] sm:h-auto sm:max-h-[90vh] pb-[max(1rem,env(safe-area-inset-bottom,0px))]"
      >
        {/* Mobile Pull Handle Indicator */}
        <div className="sm:hidden w-full flex justify-center pt-2.5 pb-1 bg-sand-50/50">
          <div className="w-10 h-1 rounded-full bg-sand-300" />
        </div>
        {/* Header */}
        <div className="p-6 border-b border-sand-200 flex items-center justify-between bg-sand-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-terracotta-100 text-terracotta-700">
                Dupe Finder AI
              </span>
              <span className="text-xs font-bold text-emerald-600 font-mono">HEMAT HINGGA 70%</span>
            </div>
            <h3 className="text-xl font-serif font-bold text-charcoal-900 mt-1">
              Clone Style Selebgram & Pinterest
            </h3>
            <p className="text-xs text-sand-500 mt-0.5">
              Upload foto inspirasi, AI akan mencari alternatif baju lokal yang mirip, adem, dan ramah kantong.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-sand-300 flex items-center justify-center text-charcoal-900/60 hover:text-charcoal-900 hover:border-charcoal-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <AnimatePresence mode="wait">
            {!image && !isAnalyzing && !result && (
              <motion.div
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-sand-300 rounded-2xl bg-sand-50 hover:bg-sand-100 hover:border-terracotta-300 transition-colors cursor-pointer group">
                    <Upload className="w-8 h-8 text-sand-400 group-hover:text-terracotta-500 mb-2 transition-colors" />
                    <span className="text-sm font-bold text-charcoal-900">Upload Foto</span>
                    <span className="text-xs text-sand-500 text-center mt-1">JPG, PNG, WebP (Max 5MB)</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                  </label>
                  
                  <button 
                    type="button"
                    onClick={handleCameraClick}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-sand-300 rounded-2xl bg-sand-50 hover:bg-sand-100 hover:border-terracotta-300 transition-colors group"
                  >
                    <Camera className="w-8 h-8 text-sand-400 group-hover:text-terracotta-500 mb-2 transition-colors" />
                    <span className="text-sm font-bold text-charcoal-900">Kamera</span>
                    <span className="text-xs text-sand-500 text-center mt-1">Foto langsung (Live)</span>
                  </button>

                  <button 
                    type="button"
                    onClick={handlePasteClick}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-sand-300 rounded-2xl bg-sand-50 hover:bg-sand-100 hover:border-terracotta-300 transition-colors group"
                  >
                    <LinkIcon className="w-8 h-8 text-sand-400 group-hover:text-terracotta-500 mb-2 transition-colors" />
                    <span className="text-sm font-bold text-charcoal-900">Paste Link / Image</span>
                    <span className="text-xs text-sand-500 text-center mt-1">Ctrl+V / Paste URL</span>
                  </button>
                </div>

                <div>
                  <div className="text-xs font-mono font-bold tracking-wider uppercase text-sand-500 mb-3 flex items-center gap-2">
                    <span className="h-px flex-1 bg-sand-200"></span>
                    <span>ATAU COBA PRESET INSPIRASI KAMI</span>
                    <span className="h-px flex-1 bg-sand-200"></span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => handlePreset(preset.img)}
                        className="group relative aspect-[3/4] rounded-xl overflow-hidden border border-sand-200 shadow-sm"
                      >
                        <img src={preset.img} alt={preset.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/30 to-transparent flex flex-col justify-end p-3 text-left">
                          <span className="text-[10px] font-mono text-sand-300 uppercase">{preset.mood}</span>
                          <span className="text-xs font-bold text-white leading-tight">{preset.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {image && isAnalyzing && (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 space-y-4 text-center"
              >
                <div className="relative w-32 h-44 rounded-2xl overflow-hidden border-2 border-terracotta-500 shadow-glow">
                  <img src={image} alt="Target Look" className="w-full h-full object-cover" />
                  <motion.div 
                    initial={{ top: "0%" }}
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-terracotta-500 shadow-glow z-10"
                  />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-charcoal-900">AI Vision Sedang Memindai Siluet & Warna...</h4>
                  <p className="text-xs text-sand-500 mt-1">Mencari padanan bahan katun rayon & linen di toko lokal...</p>
                </div>
              </motion.div>
            )}

            {image && !isAnalyzing && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="relative w-32 sm:w-40 aspect-[3/4] rounded-2xl overflow-hidden border border-sand-300 shrink-0 shadow-sm">
                    <img src={image} alt="Inspiration" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => { setImage(null); setResult(null); }}
                      className="absolute top-2 left-2 px-2 py-1 bg-charcoal-900/80 backdrop-blur-sm text-white text-[10px] font-mono rounded-lg hover:bg-charcoal-900"
                    >
                      ← Ganti Foto
                    </button>
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex items-center justify-between bg-sand-100 p-4 rounded-2xl border border-sand-200">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-sand-500 block">ESTIMASI TOTAL BUDGET DUPE</span>
                        <span className="text-base font-bold text-charcoal-900">{result.totalEst}</span>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-mono font-bold text-xs rounded-full">
                        HEMAT ~{result.saving}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {result.items.map((item: OutfitItem, idx: number) => {
                        const links = getMarketplaceLinks(item.shopeeQuery);
                        const catLabel = item.category === "outer_hijab" ? "Hijab/Outer" : item.category.charAt(0).toUpperCase() + item.category.slice(1);
                        return (
                          <div key={idx} className="p-3.5 rounded-xl border border-sand-200 bg-white shadow-sm flex flex-col sm:flex-row gap-3 sm:items-center justify-between hover:border-sand-400 transition-colors">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-sand-100 text-charcoal-800">
                                  {catLabel}
                                </span>
                                <span className="text-xs text-sand-500">•</span>
                                <span className="text-xs font-bold text-terracotta-600">{item.estimatedPrice}</span>
                              </div>
                              <p className="font-bold text-sm text-charcoal-900">{item.name} <span className="font-normal text-charcoal-900/60">({item.color})</span></p>
                            </div>
                            
                            <div className="flex items-center gap-2 shrink-0">
                              <a
                                href={links.shopee}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => trackAffiliateClick("shopee", item.shopeeQuery || item.name, "influencer_dupe")}
                                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white border border-orange-200 text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
                              >
                                Shopee
                              </a>
                              <a
                                href={links.tokopedia}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => trackAffiliateClick("tokopedia", item.shopeeQuery || item.name, "influencer_dupe")}
                                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
                              >
                                Tokped
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-sand-200 flex justify-end">
                  <button
                    onClick={handleApplyToStudio}
                    className="px-5 py-3 rounded-xl bg-charcoal-900 hover:bg-terracotta-600 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-md w-full sm:w-auto"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>🚀 Buka & Kustomisasi di Studio</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
