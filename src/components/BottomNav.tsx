"use client";

import React, { useState } from "react";
import { Compass, Bookmark, Crown, Home } from "lucide-react";
import { motion } from "framer-motion";
import WaitlistModal from "./WaitlistModal";

interface BottomNavProps {
  onOpenSavedDrawer?: () => void;
  onOpenQuiz?: () => void;
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
    { id: "studio", label: "Studio", href: "#studio" }, // Middle custom logo badge
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
          className="bg-[#181A18]/95 backdrop-blur-xl border border-white/15 rounded-2xl px-2 py-1.5 shadow-2xl flex items-center justify-around pointer-events-auto relative"
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;

            // Custom Middle Brand Badge for STUDIO
            if (item.id === "studio") {
              return (
                <div key={item.id} className="relative flex flex-col items-center -mt-6">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => handleNavClick(item.id, item.href)}
                    aria-label="Studio AI Stylist"
                    className={`relative w-14 h-14 rounded-full bg-[#181A18] flex flex-col items-center justify-center transition-all shadow-xl ${
                      isActive
                        ? "border-2 border-terracotta-500 ring-4 ring-terracotta-500/20 shadow-glow"
                        : "border-2 border-[#D7CABC]/80 hover:border-white"
                    }`}
                  >
                    {/* Inner Brand Logo */}
                    <div className="font-serif italic font-bold text-sm tracking-tight text-white flex items-baseline leading-none pt-0.5">
                      look<span className="text-terracotta-500 not-italic">.</span>u
                    </div>

                    {/* Curved Arc Text for STUDIO */}
                    <svg
                      viewBox="0 0 54 22"
                      className="w-12 h-5 overflow-visible -mt-0.5 pointer-events-none"
                    >
                      <defs>
                        <path
                          id="studio-curve-arc"
                          d="M 6,3 A 21,21 0 0,0 48,3"
                          fill="none"
                        />
                      </defs>
                      <text
                        fontSize="6"
                        fontFamily="monospace"
                        fontWeight="bold"
                        letterSpacing="0.22em"
                        fill={isActive ? "#BA5D38" : "#D7CABC"}
                      >
                        <textPath
                          href="#studio-curve-arc"
                          startOffset="50%"
                          textAnchor="middle"
                        >
                          • STUDIO •
                        </textPath>
                      </text>
                    </svg>

                    {/* Active Glow Dot */}
                    {isActive && (
                      <motion.div
                        layoutId="active-dot-studio"
                        className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-terracotta-500 ring-2 ring-white shadow-xs"
                      />
                    )}
                  </motion.button>
                </div>
              );
            }

            // Standard Navigation Tabs (Home, Lookbook, Lemari, VIP)
            const Icon = item.icon!;
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
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? "scale-110 text-terracotta-400" : ""
                    }`}
                  />
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

