"use client";

import React, { useState } from "react";
import { Sparkles, Compass, Bookmark, Crown, Home } from "lucide-react";
import { motion } from "framer-motion";
import WaitlistModal from "./WaitlistModal";

interface BottomNavProps {
  onOpenSavedDrawer?: () => void;
}

export default function BottomNav({ onOpenSavedDrawer }: BottomNavProps) {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const handleNavClick = (tabId: string, href?: string) => {
    setActiveTab(tabId);
    if (tabId === "saved" && onOpenSavedDrawer) {
      onOpenSavedDrawer();
      return;
    }
    if (tabId === "vip") {
      setIsWaitlistOpen(true);
      return;
    }
    if (href) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home, href: "#" },
    { id: "trending", label: "Lookbook", icon: Compass, href: "#trending" },
    { id: "studio", label: "Studio", icon: Sparkles, href: "#studio" },
    { id: "saved", label: "Lemari", icon: Bookmark, href: "#" },
    { id: "vip", label: "VIP", icon: Crown, href: "#" },
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] pt-3 pointer-events-none">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-[#181A18]/95 backdrop-blur-xl border border-white/15 rounded-2xl px-2 py-2 shadow-2xl flex items-center justify-around pointer-events-auto"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.href)}
                aria-label={item.label}
                className={`relative min-h-[44px] min-w-[44px] flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                  isActive ? "text-white font-bold" : "text-[#A89582] hover:text-white/80"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110 text-terracotta-400" : ""}`} />
                  {isActive && (
                    <motion.div
                      layoutId="active-dot"
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-terracotta-500 ring-2 ring-white"
                    />
                  )}
                </div>
                <span className="text-[9px] font-mono tracking-wider mt-1 uppercase">
                  {item.label}
                </span>
              </button>
            );
          })}
        </motion.div>
      </div>

      {isWaitlistOpen && (
        <WaitlistModal onClose={() => setIsWaitlistOpen(false)} />
      )}
    </>
  );
}
