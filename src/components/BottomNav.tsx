"use client";

import React, { useState, useEffect } from "react";
import { Home, Search, Sparkles, User } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("home");

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

  const handleNavClick = (tabId: string, href: string) => {
    setActiveTab(tabId);
    if (tabId === "home" && pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    router.push(href);
  };

  const navItems = [
    { id: "home", label: "HOME", icon: Home, href: "/" },
    { id: "search", label: "LOOKBOOK", icon: Search, href: "/lookbook" },
    { id: "studio", label: "STUDIO", icon: Sparkles, href: "/studio" },
    { id: "profile", label: "PROFIL & LEMARI", icon: User, href: "/profile" },
  ];

  return (
    <nav
      aria-label="Navigasi Utama"
      className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-sm rounded-full bg-[#181A18]/95 text-[#FAF8F5] backdrop-blur-md shadow-2xl px-3 py-1.5 border border-white/10 select-none pointer-events-auto"
    >
      <div className="flex items-center justify-around h-[46px] w-full">
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
                      isActive ? "text-white" : "text-white/40"
                    }`}
                    strokeWidth={isActive ? 2.5 : 1.5}
                    fill="none"
                  />
                </motion.div>
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-active-dot"
                    className="w-1.5 h-1.5 bg-terracotta-400 rounded-full mt-0.5"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
