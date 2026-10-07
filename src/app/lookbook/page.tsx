"use client";
import Navbar from "@/components/Navbar";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Search, Filter, Sparkles, Heart, Share2, ArrowUpRight, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TrendingFeed from "@/components/TrendingFeed";

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
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] pb-20 md:pb-0">
      <Navbar />
      {/* Main Content Area */}
      <main className="flex-1 max-w-md md:max-w-6xl mx-auto px-4 md:px-6 lg:px-8 pt-3 pb-8 w-full space-y-8">
        {/* Full Interactive Trending Feed Component */}
        <TrendingFeed isStandalone={true} onSelectLook={handleSelectLook} />

        </main>

      {/* Docked Native Bottom Navigation Bar */}
      

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


