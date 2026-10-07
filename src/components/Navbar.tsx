"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavbarProps {
  onOpenSavedDrawer?: () => void;
  onOpenQuiz?: () => void;
  onOpenCatalog?: () => void;
  onOpenHistory?: () => void;
}

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Studio', href: '/studio' },
  { name: 'Lookbook', href: '/lookbook' },
  { name: 'Wardrobe', href: '/lemari' }
];

export default function Navbar({ onOpenSavedDrawer, onOpenQuiz, onOpenCatalog, onOpenHistory }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

            {/* Right Icons (Search, Bag, Profile) */}
            <div className="flex items-center justify-end gap-5 flex-1 text-black">
              <button 
                onClick={() => onOpenCatalog ? onOpenCatalog() : router.push("/lookbook")} 
                className="hover:text-terracotta-500 hover:scale-110 active:scale-95 transition-all duration-200" 
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>
              <button 
                onClick={() => onOpenSavedDrawer ? onOpenSavedDrawer() : router.push("/lemari")} 
                className="hover:text-terracotta-500 hover:scale-110 active:scale-95 transition-all duration-200 relative" 
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
