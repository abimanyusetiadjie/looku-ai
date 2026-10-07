"use client";

import React, { useState, useEffect } from "react";
import { Home, Search, Sparkles, Shirt, User } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<string>("home");

  // Sync active tab with route
  useEffect(() => {
    if (pathname === "/lemari") {
      setActiveTab("wardrobe");
    } else if (pathname === "/studio") {
      setActiveTab("studio");
    } else if (pathname === "/lookbook" || pathname === "/search") {
      setActiveTab("search");
    } else if (pathname === "/profile") {
      setActiveTab("profile");
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
    { id: "search", label: "SEARCH", icon: Search, href: "/lookbook" },
    { id: "studio", label: "STUDIO", icon: Sparkles, href: "/studio" },
    { id: "wardrobe", label: "WARDROBE", icon: Shirt, href: "/lemari" },
    { id: "profile", label: "PROFILE", icon: User, href: "/profile" },
  ];

  return (
    <nav
      aria-label="Navigasi Utama"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 w-full select-none pointer-events-auto bg-white border-t border-[#E8DFD1]"
    >
      <div className="pb-[max(8px,env(safe-area-inset-bottom,0px))]">
        <div className="flex justify-around items-center h-[52px] px-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            
            // Search icon in lucide is just lines, so we thicken it for active state instead of filling
            const isSearch = item.id === "search";
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.href)}
                aria-label={item.label}
                className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] w-14"
              >
                <div className="relative flex items-center justify-center">
                  {/* Animasi scale/bounce kecil saat ditekan, khas Instagram */}
                  <motion.div
                    whileTap={{ scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Icon
                      className={`w-[26px] h-[26px] transition-all duration-200 ${
                        isActive ? "text-charcoal-900" : "text-charcoal-900/40"
                      }`}
                      strokeWidth={isActive ? 2.5 : 1.5}
                      fill="none"
                    />
                  </motion.div>
                </div>
                {/* Teks label disembunyikan agar benar-benar bersih seperti Instagram, 
                    namun tetap terbaca oleh screen reader melalui aria-label */}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

