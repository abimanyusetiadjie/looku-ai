"use client";

import React, { useState, useEffect } from "react";
import { Compass, Bookmark, Home, Sparkles, Palette } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

interface BottomNavProps {
  onOpenSavedDrawer?: () => void;
  onOpenQuiz?: () => void;
}

export default function BottomNav({ onOpenSavedDrawer, onOpenQuiz }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("home");
  const [savedCount, setSavedCount] = useState<number>(0);

  // Sync active tab with route
  useEffect(() => {
    if (pathname === "/lemari") {
      setActiveTab("saved");
    } else if (pathname === "/studio") {
      setActiveTab("studio");
    } else if (pathname === "/lookbook") {
      setActiveTab("lookbook");
    } else if (pathname === "/") {
      setActiveTab("home");
    } else {
      setActiveTab("");
    }
  }, [pathname]);

  // Sync saved count from localStorage
  useEffect(() => {
    const updateCount = () => {
      try {
        const stored = localStorage.getItem("looku_saved_outfits");
        if (stored) {
          setSavedCount(JSON.parse(stored).length);
        } else {
          setSavedCount(0);
        }
      } catch (e) {
        console.error(e);
      }
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("looku_saved_updated", updateCount);
    const interval = setInterval(updateCount, 3000);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("looku_saved_updated", updateCount);
      clearInterval(interval);
    };
  }, []);

  const handleNavClick = (tabId: string, href: string) => {
    setActiveTab(tabId);
    if (tabId === "home" && pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    router.push(href);
  };

  const handleQuizClick = () => {
    if (onOpenQuiz) {
      onOpenQuiz();
    } else {
      router.push("/?openQuiz=true");
    }
  };

  // Tab config — Beranda, Studio AI, [Kuis Warna raised], Lookbook, Lemari
  const sideNavItems = [
    { id: "home", label: "Beranda", icon: Home, href: "/" },
    { id: "studio", label: "Studio AI", icon: Sparkles, href: "/studio" },
    // Center slot reserved for Kuis Warna
    { id: "lookbook", label: "Lookbook", icon: Compass, href: "/lookbook" },
    { id: "saved", label: "Lemari", icon: Bookmark, href: "/lemari" },
  ];

  return (
    <nav
      aria-label="Navigasi Utama"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 w-full select-none pointer-events-auto"
    >
      <div className="bg-white/95 backdrop-blur-lg border-t border-[#E8DFD1] shadow-[0_-2px_16px_rgba(0,0,0,0.06)] pb-[max(8px,env(safe-area-inset-bottom,0px))]">
        <div className="max-w-md mx-auto grid grid-cols-5 h-[60px] items-stretch relative">
          {/* Left 2 tabs: Beranda, Studio AI */}
          {sideNavItems.slice(0, 2).map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.href)}
                aria-label={item.label}
                className="relative flex flex-col items-center justify-center pt-1 pb-0.5 transition-all min-h-[44px]"
              >
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={`w-[22px] h-[22px] transition-all ${
                      isActive
                        ? "text-sage-700 stroke-[2.2]"
                        : "text-stone-400 stroke-[1.75]"
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] mt-0.5 transition-colors ${
                    isActive ? "font-bold text-sage-700" : "font-medium text-stone-400"
                  }`}
                >
                  {item.label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-dot"
                    className="absolute bottom-0 w-1 h-1 rounded-full bg-terracotta-500"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
              </button>
            );
          })}

          {/* Center: Raised Kuis Warna Button */}
          <div className="relative flex items-center justify-center">
            <button
              onClick={handleQuizClick}
              aria-label="Kuis Warna Personal Color"
              className="absolute -top-4 w-[52px] h-[52px] rounded-full bg-sage-600 hover:bg-sage-700 active:scale-95 text-white flex flex-col items-center justify-center shadow-lg transition-all border-[3px] border-white min-h-[44px] min-w-[44px]"
            >
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-terracotta-500 border-2 border-white animate-pulse" />
              <Palette className="w-5 h-5" />
            </button>
            <span className="absolute bottom-0.5 text-[9px] font-bold text-sage-700 whitespace-nowrap">
              Kuis Warna
            </span>
          </div>

          {/* Right 2 tabs: Lookbook, Lemari */}
          {sideNavItems.slice(2).map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.href)}
                aria-label={item.label}
                className="relative flex flex-col items-center justify-center pt-1 pb-0.5 transition-all min-h-[44px]"
              >
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={`w-[22px] h-[22px] transition-all ${
                      isActive
                        ? "text-sage-700 stroke-[2.2]"
                        : "text-stone-400 stroke-[1.75]"
                    }`}
                  />

                  {item.id === "saved" && savedCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] px-1 rounded-full bg-terracotta-500 text-white text-[9px] font-mono font-bold flex items-center justify-center border-2 border-white shadow-sm">
                      {savedCount > 9 ? "9+" : savedCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] mt-0.5 transition-colors ${
                    isActive ? "font-bold text-sage-700" : "font-medium text-stone-400"
                  }`}
                >
                  {item.label}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-dot"
                    className="absolute bottom-0 w-1 h-1 rounded-full bg-terracotta-500"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
