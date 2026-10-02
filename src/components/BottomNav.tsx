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
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 w-full select-none pointer-events-auto bg-white border-t border-[#F0EBE1]"
    >
      <div className="pb-[max(8px,env(safe-area-inset-bottom,0px))]">
        <div className="flex justify-between items-center h-[60px] px-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.href)}
                aria-label={item.label}
                className="flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px]"
              >
                <div className="relative flex items-center justify-center">
                  <Icon
                    className={`w-[22px] h-[22px] stroke-[1.2] transition-colors \${
                      isActive ? "text-[#181A18]" : "text-[#181A18]/40"
                    }`}
                  />
                </div>
                <span
                  className={`text-[8px] font-sans tracking-[0.05em] transition-colors mt-0.5 \${
                    isActive ? "font-bold text-[#181A18]" : "font-medium text-[#181A18]/40"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

