"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CloudSyncModal from "./CloudSyncModal";
import PersonalColorQuizModal from "./PersonalColorQuizModal";

interface NavbarProps {
  onOpenSavedDrawer?: () => void;
  onOpenQuiz?: () => void;
  onOpenCatalog?: () => void;
  onOpenHistory?: () => void;
}

export default function Navbar({ onOpenSavedDrawer, onOpenQuiz, onOpenCatalog, onOpenHistory }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-40 w-full bg-white transition-shadow ${scrolled ? 'shadow-sm' : 'border-b border-[#F0EBE1]'}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Desktop Left Navigation */}
            <div className="hidden lg:flex items-center gap-8 flex-1">
              {[
  { name: 'Home', href: '/' },
  { name: 'Studio', href: '/studio' },
  { name: 'Lookbook', href: '/lookbook' },
  { name: 'Wardrobe', href: '/lemari' }
].map((item) => (
                <Link key={item.name} href={item.href} className="text-[11px] font-sans font-semibold tracking-widest text-charcoal-900 uppercase hover:text-terracotta-500 transition-colors">
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden flex-1">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 -ml-2 text-charcoal-900"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 stroke-[1.5]" /> : <Menu className="w-5 h-5 stroke-[1.5]" />}
              </button>
            </div>

            {/* Center Logo */}
            <div className="flex justify-center flex-1">
              <Link href="/" className="font-serif font-medium text-3xl sm:text-4xl tracking-[0.05em] text-[#181A18] flex items-baseline select-none">
                Look<span className="text-terracotta-500 font-bold">.</span>u
              </Link>
            </div>

            {/* Right Icons (Search, Bag, Profile) */}
            <div className="flex items-center justify-end gap-5 flex-1 text-charcoal-900">
              <button onClick={onOpenCatalog} className="hover:text-terracotta-500 transition-colors" aria-label="Search">
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>
              <button onClick={onOpenSavedDrawer} className="hover:text-terracotta-500 transition-colors relative" aria-label="Bag">
                <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              </button>
              <Link href="/profile" className="hidden sm:block hover:text-terracotta-500 transition-colors" aria-label="Profile">
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
                {[
  { name: 'Home', href: '/' },
  { name: 'Studio', href: '/studio' },
  { name: 'Lookbook', href: '/lookbook' },
  { name: 'Wardrobe', href: '/lemari' }
].map((item) => (
                <Link key={item.name} href={item.href} onClick={() => setMobileMenuOpen(false)} className="text-sm font-sans font-semibold tracking-widest text-charcoal-900 uppercase">
                    {item.name}
                </Link>
                ))}
                <div className="h-px bg-[#F0EBE1] w-full my-2"></div>
                <Link href="/profile" className="text-sm font-sans font-semibold tracking-widest text-charcoal-900 uppercase">
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
