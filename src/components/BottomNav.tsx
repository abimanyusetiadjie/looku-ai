"use client";

import React, { useState, useEffect } from "react";
import { Compass, Bookmark, Home, User, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

interface BottomNavProps {
  onOpenSavedDrawer?: () => void;
  onOpenQuiz?: () => void;
}

export default function BottomNav({ onOpenSavedDrawer }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("home");
  const [savedCount, setSavedCount] = useState<number>(0);

  // Sync active tab with route
  useEffect(() => {
    if (pathname === "/profile") {
      setActiveTab("profile");
    } else if (pathname === "/lemari") {
      setActiveTab("saved");
    } else if (pathname === "/studio") {
      setActiveTab("studio");
    } else if (pathname === "/lookbook") {
      setActiveTab("trending");
    } else if (pathname === "/") {
      setActiveTab("home");
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
    const interval = setInterval(updateCount, 2000);
    return () => {
      window.removeEventListener("storage", updateCount);
      clearInterval(interval);
    };
  }, []);

  const handleNavClick = (tabId: string, href: string) => {
    setActiveTab(tabId);
    if (tabId === "saved") {
      if (onOpenSavedDrawer && pathname !== "/lemari") {
        router.push("/lemari");
      } else {
        router.push("/lemari");
      }
      return;
    }
    if (tabId === "home" && pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    router.push(href);
  };

  const navItems = [
    { id: "home", label: "Beranda", icon: Home, href: "/" },
    { id: "trending", label: "Lookbook", icon: Compass, href: "/lookbook" },
    { id: "studio", label: "Studio", icon: Sparkles, href: "/studio" },
    { id: "saved", label: "Lemari", icon: Bookmark, href: "/lemari" },
    { id: "profile", label: "Profil", icon: User, href: "/profile" },
  ];

  return (
    <nav
      aria-label="Navigasi Bawah Ponsel"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 w-full bg-[#121212] backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-8px_24px_rgba(0,0,0,0.5)] select-none pointer-events-auto"
    >
      <div className="grid grid-cols-5 h-[56px] sm:h-[60px] items-stretch">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, item.href)}
              aria-label={item.label}
              className={`relative flex flex-col items-center justify-center pt-1.5 pb-1 transition-all ${
                isActive
                  ? "text-white"
                  : "text-[#8E8E8E] hover:text-[#C5C5C5] active:opacity-70"
              }`}
            >
              {/* Native App Top Highlight Line Indicator (Matching TikTok / Instagram) */}
              {isActive && (
                <motion.div
                  layoutId="native-top-active-indicator"
                  className="absolute top-0 inset-x-3 h-[2px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive
                      ? "scale-105 text-white stroke-[2.2]"
                      : "stroke-[1.75]"
                  }`}
                />

                {/* Lemari Count Badge Dot */}
                {item.id === "saved" && savedCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-1 rounded-full bg-terracotta-500 text-white text-[8px] font-mono font-bold flex items-center justify-center border border-[#121212] shadow-xs">
                    {savedCount > 9 ? "9+" : savedCount}
                  </span>
                )}
              </div>

              {/* Native Text Label */}
              <span
                className={`text-[10px] tracking-tight mt-1 transition-colors ${
                  isActive ? "font-bold text-white" : "font-medium text-[#8E8E8E]"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

