const fs = require('fs');
const path = require('path');

const content = `"use client";

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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header 
        className={"sticky top-0 z-40 w-full transition-all duration-300 " + (scrolled ? "bg-white/85 backdrop-blur-md shadow-sm border-b border-transparent" : "bg-white border-b border-black/5")}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Desktop Left Navigation */}
            <div className="hidden lg:flex items-center gap-8 flex-1">
              {NAV_LINKS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.name} 
                    href={item.href} 
                    className={"text-[11px] font-sans font-semibold tracking-widest uppercase transition-all duration-200 relative " + (isActive ? "text-black" : "text-black/50 hover:text-black")}
                  >
                    {item.name}
                    {/* Active Indicator (Dot) */}
                    {isActive && (
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-black rounded-full" />
                    )}
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
                <Link href="/profile" className="text-sm font-sans font-semibold tracking-widest text-black/60 uppercase hover:text-black transition-colors">
                  Profile
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
`;

fs.writeFileSync(path.join(process.cwd(), 'src/components/Navbar.tsx'), content, 'utf8');
console.log("Navbar correctly formatted and written.");
