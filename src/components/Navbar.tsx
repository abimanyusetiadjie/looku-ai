"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X, Bookmark } from "lucide-react";
import WaitlistModal from "./WaitlistModal";

interface NavbarProps {
  onOpenSavedDrawer?: () => void;
}

export default function Navbar({ onOpenSavedDrawer }: NavbarProps) {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState<number>(0);

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

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8DFD1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Signature Boutique Logo: look.u */}
            <Link href="/" className="flex items-center gap-3 group">
              <span className="font-serif italic font-bold text-2xl sm:text-3xl tracking-tight text-[#181A18] group-hover:opacity-90 transition-opacity">
                look<span className="text-terracotta-500 not-italic">.</span>u
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#A89582] border-l border-[#D7CABC] pl-3 py-0.5">
                Edition 2026
              </span>
            </Link>

            {/* Editorial Nav Links */}
            <nav className="hidden md:flex items-center gap-8 text-[13px] tracking-wider uppercase font-medium text-[#181A18]/70">
              <a
                href="#trending"
                className="hover:text-[#181A18] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#181A18] after:transition-all"
              >
                Lookbook
              </a>
              <a
                href="#studio"
                className="hover:text-[#181A18] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#181A18] after:transition-all"
              >
                AI Stylist
              </a>
              <a
                href="#manifesto"
                className="hover:text-[#181A18] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#181A18] after:transition-all"
              >
                How It Works
              </a>
              <a
                href="#faq"
                className="hover:text-[#181A18] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1px] after:bg-[#181A18] after:transition-all"
              >
                FAQ
              </a>
            </nav>

            {/* Action Buttons: Saved Looks Counter & VIP */}
            <div className="hidden md:flex items-center gap-3">
              {onOpenSavedDrawer && (
                <button
                  onClick={onOpenSavedDrawer}
                  className="px-3.5 py-2 text-xs font-bold tracking-wider uppercase rounded-full bg-white hover:bg-gray-100 text-black border-2 border-black transition-all flex items-center gap-1.5 shadow-sm"
                  title="Buka Lemari Koleksi"
                >
                  <Bookmark className="w-4 h-4 text-terracotta-600" />
                  <span>Lemari {savedCount > 0 && <span className="bg-terracotta-500 text-white px-1.5 py-0.5 rounded-full text-[10px] ml-1">{savedCount}</span>}</span>
                </button>
              )}

              <button
                onClick={() => setIsWaitlistOpen(true)}
                className="px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-full bg-black hover:bg-terracotta-600 text-white border-2 border-black transition-all flex items-center gap-1.5 shadow-sm"
              >
                <span>Akses VIP</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden flex items-center gap-2">
              {onOpenSavedDrawer && (
                <button
                  onClick={onOpenSavedDrawer}
                  className="p-2 text-[#181A18] hover:bg-[#E8DFD1]/50 rounded-lg transition-colors relative"
                  title="Lemari Koleksi"
                >
                  <Bookmark className="w-5 h-5 text-terracotta-600" />
                  {savedCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-terracotta-500" />
                  )}
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#181A18] hover:bg-[#E8DFD1]/50 rounded-lg transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-6 py-6 bg-[#FAF8F5] border-b border-[#E8DFD1] space-y-4 animate-fadeIn">
            <a
              href="#trending"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs uppercase tracking-wider font-semibold text-[#181A18]"
            >
              Lookbook
            </a>
            <a
              href="#studio"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs uppercase tracking-wider font-semibold text-[#181A18]"
            >
              AI Stylist
            </a>
            <a
              href="#manifesto"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs uppercase tracking-wider font-semibold text-[#181A18]"
            >
              How It Works
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs uppercase tracking-wider font-semibold text-[#181A18]"
            >
              FAQ
            </a>
            <div className="pt-2 space-y-2">
              {onOpenSavedDrawer && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSavedDrawer();
                  }}
                  className="w-full py-2.5 text-xs font-bold tracking-wider uppercase rounded-xl bg-white border-2 border-black text-black flex items-center justify-center gap-1.5"
                >
                  <Bookmark className="w-4 h-4 text-terracotta-600" />
                  <span>Lemari Koleksi {savedCount > 0 && <span className="bg-terracotta-500 text-white px-1.5 py-0.5 rounded-full text-[10px] ml-1">{savedCount}</span>}</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsWaitlistOpen(true);
                }}
                className="w-full py-3 text-xs font-bold tracking-wider uppercase rounded-xl bg-black border-2 border-black text-white hover:bg-terracotta-600 transition-all text-center"
              >
                Akses VIP
              </button>
            </div>
          </div>
        )}
      </header>

      {isWaitlistOpen && (
        <WaitlistModal onClose={() => setIsWaitlistOpen(false)} />
      )}
    </>
  );
}
