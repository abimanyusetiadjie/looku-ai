"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Search, Filter, Sparkles, Heart, Share2, ArrowUpRight, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TrendingFeed from "@/components/TrendingFeed";
import BottomNav from "@/components/BottomNav";
import { OOTDRecommendation } from "@/lib/types";
import { useRouter } from "next/navigation";

// Dynamic Code-Splitting
const StoryShareModal = dynamic(() => import("@/components/StoryShareModal"), { ssr: false });
const OOTDChallengeSection = dynamic(() => import("@/components/OOTDChallengeSection"), { ssr: false });

export default function LookbookPage() {
  const router = useRouter();
  const [storyOutfit, setStoryOutfit] = useState<OOTDRecommendation | null>(null);

  const handleSelectLook = (outfit: OOTDRecommendation) => {
    // Navigate directly to Studio with the selected look ID
    router.push(`/studio?look=${outfit.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] pb-36 md:pb-0">
      {/* Lookbook App Header Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8DFD1] pt-[max(0px,env(safe-area-inset-top))]">
        <div className="max-w-md md:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 h-12 md:h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white border border-sand-300 text-charcoal-900 hover:bg-sand-100 transition-colors shadow-2xs flex items-center justify-center"
              aria-label="Kembali ke Beranda"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-terracotta-500" />
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-sand-500">
                  KATALOG 2026
                </span>
              </div>
              <h1 className="font-serif font-bold text-base sm:text-lg text-[#181A18] leading-tight">
                Lookbook Tropis
              </h1>
            </div>
          </div>

          <Link
            href="/studio"
            className="py-1.5 px-3.5 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-terracotta-400" />
            <span>Studio OOTD</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-md md:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-3 pb-8 w-full space-y-8">
        {/* Full Interactive Trending Feed Component */}
        <TrendingFeed
          onSelectLook={handleSelectLook}
          isStandalone={true}
        />

        {/* Community OOTD Challenge Section */}
        <div className="hidden md:block pt-6 border-t border-sand-200">
          <OOTDChallengeSection />
        </div>
      </main>

      {/* Floating CTA Mobile */}
      <div className="md:hidden fixed bottom-[76px] inset-x-0 z-40 pointer-events-none flex justify-center pb-2">
        <div className="w-full max-w-md px-4 flex justify-center">
          <Link
            href="/studio"
            className="pointer-events-auto w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-sage-600 hover:bg-sage-700 text-white font-bold text-sm shadow-lg shadow-sage-600/20 active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4 text-sage-200" />
            <span>Racik OOTD di Studio ➔</span>
          </Link>
        </div>
      </div>

      {/* Docked Native Bottom Navigation Bar */}
      <BottomNav />

      {/* Story Share Modal */}
      {storyOutfit && (
        <StoryShareModal
          outfit={storyOutfit}
          onClose={() => setStoryOutfit(null)}
        />
      )}
    </div>
  );
}
