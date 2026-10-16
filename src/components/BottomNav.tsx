"use client";

import React, { useState, useEffect } from "react";
import { Home, Search, Sparkles, User } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("home");
  const [savedCount, setSavedCount] = useState<number>(0);

  // Sync active tab with route
  useEffect(() => {
    if (pathname === "/lemari" || pathname === "/profile") {
      setActiveTab("profile");
    } else if (pathname === "/studio") {
      setActiveTab("studio");
    } else if (pathname === "/lookbook" || pathname === "/search") {
      setActiveTab("search");
    } else if (pathname === "/") {
      setActiveTab("home");
    } else {
      setActiveTab("");
    }
  }, [pathname]);

  // Sync saved count for in-menu badge (Instagram style)
  useEffect(() => {
    const updateCount = () => {
      try {
        const stored = localStorage.getItem("looku_saved_outfits");
        if (stored) {
          setSavedCount(JSON.parse(stored).length);
        } else {
          setSavedCount(0);
        }
      } catch {
        setSavedCount(0);
      }
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("looku_saved_updated", updateCount);
    const interval = setInterval(updateCount, 1500);
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

  const navItems = [
    { id: "home", label: "BERANDA", icon: Home, href: "/" },
    { id: "search", label: "LOOKBOOK", icon: Search, href: "/lookbook" },
    { id: "studio", label: "STUDIO", icon: Sparkles, href: "/studio" },
    { id: "profile", label: "LEMARI", icon: User, href: "/profile", badge: savedCount },
  ];

  return (
    <nav
      aria-label="Navigasi Utama"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 w-full select-none pointer-events-auto bg-white/95 backdrop-blur-md border-t border-[#E8DFD1] shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center justify-around h-[52px] w-full max-w-md mx-auto px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id, item.href)}
              aria-label={item.label}
              className="flex items-center justify-center flex-1 h-full relative"
            >
              <div className="relative flex flex-col items-center justify-center">
                <motion.div
                  whileTap={{ scale: 0.85 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Icon
                    className={`w-[22px] h-[22px] transition-all duration-200 ${
                      isActive ? "text-[#181A18]" : "text-[#181A18]/40"
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    fill="none"
                  />
                </motion.div>

                {/* Instagram-style In-Menu Notification / Saved Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-terracotta-500 text-white text-[10px] font-bold font-mono leading-none flex items-center justify-center shadow-xs ring-2 ring-white">
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active-dot"
                    className="w-1.5 h-1.5 bg-terracotta-500 rounded-full mt-1"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
      {/* Safe Area for iOS Home Indicator */}
      <div className="h-[env(safe-area-inset-bottom,0px)] pb-1" />
    </nav>
  );
}
