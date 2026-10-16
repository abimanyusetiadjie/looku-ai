"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import StudioView from "@/components/StudioView";
import Toast, { ToastMessage } from "@/components/Toast";
import { OOTDRecommendation } from "@/lib/types";
import { PRESET_OOTD_COLLECTION } from "@/lib/presets";

// Dynamic Code-Splitting for Heavy Modals & Offscreen Widgets
const SavedLooksDrawer = dynamic(() => import("@/components/SavedLooksDrawer"), { ssr: false });
const StoryShareModal = dynamic(() => import("@/components/StoryShareModal"), { ssr: false });
const GenerationHistoryModal = dynamic(() => import("@/components/GenerationHistoryModal"), { ssr: false });
const WeeklyOutfitCalendar = dynamic(() => import("@/components/WeeklyOutfitCalendar"), { ssr: false });
const PWAInstallBanner = dynamic(() => import("@/components/PWAInstallBanner"), { ssr: false });

export default function StudioPage() {
  const [initialLookId, setInitialLookId] = useState<string | null>(null);
  const [currentOutfit, setCurrentOutfit] = useState<OOTDRecommendation | null>(() => 
    PRESET_OOTD_COLLECTION["kuliah_hijab_panas_hemat"] || null
  );
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [storyOutfitToExport, setStoryOutfitToExport] = useState<OOTDRecommendation | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Deep-Link URL query handler on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const look = params.get("look");
      if (look) {
        setInitialLookId(look);
        if (PRESET_OOTD_COLLECTION[look]) {
          setCurrentOutfit(PRESET_OOTD_COLLECTION[look]);
        }
      }
    }
  }, []);

  // Listen for Chatbot / Widget load to studio events
  useEffect(() => {
    const handleLoadToStudio = (e: Event) => {
      const customEvent = e as CustomEvent<OOTDRecommendation>;
      if (customEvent.detail) {
        setCurrentOutfit(customEvent.detail);
        addToast({
          title: "Outfit Dimuat ke Studio!",
          description: customEvent.detail.title,
          type: "curate",
        });
      }
    };

    window.addEventListener("looku_load_outfit_to_studio", handleLoadToStudio);
    return () => {
      window.removeEventListener("looku_load_outfit_to_studio", handleLoadToStudio);
    };
  }, []);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const handleSaveOutfit = (outfit: OOTDRecommendation) => {
    setCurrentOutfit(outfit);
    addToast({
      title: "Tersimpan di Lemari",
      description: `${outfit.title} berhasil disimpan & siap dijadwalkan.`,
      type: "success",
    });
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#FAF8F5]">
      {/* Desktop Top Navbar (Hidden on Mobile to keep 100dvh studio fit) */}
      <div className="hidden md:block">
        <Navbar 
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        />
      </div>

      {/* Main Studio Workstation (Uniqlo Utilitarian x Interactive Bento Studio) */}
      <main className="flex-1 w-full flex flex-col items-center">
        <StudioView 
          initialLookId={initialLookId}
          onSaveOutfit={handleSaveOutfit}
        />

        {/* Desktop-Only Weekly Planner Accordion */}
        {currentOutfit && (
          <div className="hidden md:block w-full max-w-6xl mx-auto px-6 lg:px-8 mt-6 pb-20 border-t border-[#181A18]/10 pt-6">
            <button
              type="button"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="w-full py-3.5 px-5 bg-white hover:bg-stone-50 border border-[#181A18]/15 rounded-2xl text-[#181A18] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-2xs transition-all"
            >
              <span>📅 JADWALKAN OOTD INI KE KALENDER MINGGUAN</span>
              <span className="text-terracotta-600 font-bold">
                {isCalendarOpen ? "Tutup ▲" : "Buka Kalender ▼"}
              </span>
            </button>

            {isCalendarOpen && (
              <div className="mt-4">
                <WeeklyOutfitCalendar
                  currentOutfit={currentOutfit}
                  onSelectDayOutfit={(outfit) => setCurrentOutfit(outfit)}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Saved Looks Drawer (Loaded on Demand) */}
      {isSavedDrawerOpen && (
        <SavedLooksDrawer
          isOpen={isSavedDrawerOpen}
          onClose={() => setIsSavedDrawerOpen(false)}
          onSelectOutfit={(outfit) => setCurrentOutfit(outfit)}
          onExportStory={(outfit) => setStoryOutfitToExport(outfit)}
        />
      )}

      {/* Story Share Modal */}
      {storyOutfitToExport && (
        <StoryShareModal
          outfit={storyOutfitToExport}
          onClose={() => setStoryOutfitToExport(null)}
        />
      )}

      {/* Generation History Modal */}
      {isHistoryOpen && (
        <GenerationHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onSelectOutfit={(outfit) => setCurrentOutfit(outfit)}
        />
      )}

      {/* PWA Install Banner */}
      <PWAInstallBanner />

      {/* Toast Feedback Messages */}
      <Toast toasts={toasts} onDismiss={(id) => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  );
}
