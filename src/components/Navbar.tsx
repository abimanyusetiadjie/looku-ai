"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, ShoppingBag, User, Menu, X, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onOpenSavedDrawer?: () => void;
  onOpenQuiz?: () => void;
  onOpenCatalog?: () => void;
  onOpenHistory?: () => void;
}

interface SkinToneInfo {
  id: string;
  label: string;
  undertone: string;
  hex: string;
}

const SKIN_TONE_MAP: Record<string, SkinToneInfo> = {
  fair: { id: "fair", label: "Putih Gading", undertone: "Cool", hex: "#F7E6D8" },
  fair_porcelain: { id: "fair", label: "Putih Gading", undertone: "Cool", hex: "#F7E6D8" },
  light: { id: "light", label: "Kuning Langsat", undertone: "Neutral", hex: "#EAD0B3" },
  light_medium: { id: "light", label: "Kuning Langsat", undertone: "Neutral", hex: "#EAD0B3" },
  medium: { id: "medium", label: "Sawo Matang", undertone: "Warm", hex: "#C78E5F" },
  sawo_matang: { id: "medium", label: "Sawo Matang", undertone: "Warm", hex: "#C78E5F" },
  tan: { id: "tan", label: "Eksotis Tropis", undertone: "Warm", hex: "#9E6738" },
  tan_exotic: { id: "tan", label: "Eksotis Tropis", undertone: "Warm", hex: "#9E6738" },
  deep: { id: "deep", label: "Deep Bronze", undertone: "Deep", hex: "#5D3B22" },
  dark_ebony: { id: "deep", label: "Deep Bronze", undertone: "Deep", hex: "#5D3B22" },
};

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Studio', href: '/studio' },
  { name: 'Lookbook', href: '/lookbook' },
  { name: 'Wardrobe', href: '/profile?tab=wardrobe' }
];

export default function Navbar({ onOpenSavedDrawer, onOpenQuiz, onOpenCatalog, onOpenHistory }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [personalColor, setPersonalColor] = useState<SkinToneInfo | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncColor = () => {
      try {
        const stored = localStorage.getItem("looku_personal_color");
        if (stored && SKIN_TONE_MAP[stored]) {
          setPersonalColor(SKIN_TONE_MAP[stored]);
        } else {
          setPersonalColor(null);
        }
      } catch {
        setPersonalColor(null);
      }
    };
    syncColor();
    window.addEventListener("storage", syncColor);
    window.addEventListener("looku_personal_color_updated", syncColor);
    return () => {
      window.removeEventListener("storage", syncColor);
      window.removeEventListener("looku_personal_color_updated", syncColor);
    };
  }, []);

  // Temukan tab yang sedang aktif berdasarkan rute saat ini
  const activeTabName = NAV_LINKS.find(item => pathname === item.href)?.name;
  const currentIndicator = hoveredTab || activeTabName;

  return (
    <>
      <header 
        className={"sticky top-0 z-40 w-full transition-all duration-300 " + (scrolled ? "bg-white/85 backdrop-blur-md shadow-sm border-b border-transparent" : "bg-white border-b border-black/5")}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Desktop Left Navigation */}
            <div 
              className="hidden lg:flex items-center gap-2 flex-1"
              onMouseLeave={() => setHoveredTab(null)}
            >
              {NAV_LINKS.map((item) => {
                const isActive = pathname === item.href;
                const isIndicatorActive = currentIndicator === item.name;
                
                return (
                  <Link 
                    key={item.name} 
                    href={item.href} 
                    onMouseEnter={() => setHoveredTab(item.name)}
                    aria-current={isActive ? "page" : undefined}
                    className={"inline-flex items-center min-h-[44px] px-3 text-[12px] font-sans font-semibold tracking-[0.14em] uppercase transition-colors duration-200 relative " + (isIndicatorActive ? "text-black" : "text-black/50")}
                  >
                    <span className="relative py-1">
                      {item.name}
                      {/* Magic Hover Elegant Underline */}
                      {isIndicatorActive && (
                        <motion.div
                          layoutId="desktop-nav-underline"
                          className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-black"
                          initial={false}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden flex-1">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-2 text-black hover:scale-110 active:scale-95 transition-transform"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
              </button>
            </div>

            {/* Center Logo */}
            <div className="flex justify-center flex-1">
              <Link href="/" className="font-serif font-medium text-3xl sm:text-4xl tracking-[0.05em] text-black flex items-baseline select-none hover:scale-[1.02] active:scale-95 transition-transform">
                Look<span className="text-terracotta-500 font-bold">.</span>u
              </Link>
            </div>

            {/* Right Icons (Personal Color Badge, Search, Bag, Profile) */}
            <div className="flex items-center justify-end gap-3 sm:gap-4 flex-1 text-black">
              {/* Personal Color Smart Badge */}
              {personalColor ? (
                <button
                  type="button"
                  onClick={() => onOpenQuiz ? onOpenQuiz() : router.push("/profile?tab=palette")}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#FAF6EE] hover:bg-[#F3ECE0] border border-[#E8DFD1] transition-all text-[11px] font-sans font-medium text-charcoal-900 tracking-wide shadow-2xs group cursor-pointer"
                  title="Warna kulit terdiagnosis. Klik untuk re-tes kuis."
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/15 shrink-0 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: personalColor.hex }}
                  />
                  <span className="hidden md:inline font-semibold text-charcoal-900">{personalColor.label}</span>
                  <span className="text-[9px] font-mono uppercase text-charcoal-900/60 tracking-wider">
                    {personalColor.undertone}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenQuiz ? onOpenQuiz() : router.push("/?quiz=true")}
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] hover:bg-sand-100 border border-sand-300 text-[11px] font-sans font-semibold text-charcoal-900/80 hover:text-charcoal-900 tracking-wider transition-colors cursor-pointer"
                  title="Cari tahu palet warna terbaikmu"
                >
                  <Palette className="w-3 h-3 text-terracotta-500" />
                  <span>Tes Warna</span>
                </button>
              )}

              <button 
                onClick={() => onOpenCatalog ? onOpenCatalog() : router.push("/lookbook")} 
                className="hover:text-terracotta-500 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer" 
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>
              <button 
                onClick={() => onOpenSavedDrawer ? onOpenSavedDrawer() : router.push("/profile?tab=wardrobe")} 
                className="hover:text-terracotta-500 hover:scale-110 active:scale-95 transition-all duration-200 relative cursor-pointer" 
                aria-label="Bag"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              </button>
              <Link 
                href="/profile" 
                className="hidden sm:block hover:text-terracotta-500 hover:scale-110 active:scale-95 transition-all duration-200" 
                aria-label="Profile"
              >
                <User className="w-5 h-5 stroke-[1.5]" />
              </Link>
            </div>

          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-[#F0EBE1] overflow-hidden"
            >
              <div className="px-4 py-6 flex flex-col gap-6">
                {NAV_LINKS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link 
                      key={item.name} 
                      href={item.href} 
                      onClick={() => setMobileMenuOpen(false)} 
                      className={"text-sm font-sans tracking-widest uppercase flex items-center justify-between " + (isActive ? "font-bold text-black" : "font-semibold text-black/60")}
                    >
                      <span>{item.name}</span>
                      {isActive && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                    </Link>
                  );
                })}
                <div className="h-px bg-black/5 w-full my-2"></div>
                <Link 
                  href="/profile" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={"text-sm font-sans tracking-widest uppercase flex items-center justify-between " + (pathname === '/profile' ? "font-bold text-black" : "font-semibold text-black/60")}
                >
                  <span>Profile</span>
                  {pathname === '/profile' && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
