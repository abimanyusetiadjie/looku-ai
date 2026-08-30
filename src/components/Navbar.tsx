import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X, Bookmark, Palette, ChevronDown, ChevronRight, Sparkles, Store, Camera, HelpCircle, BookOpen, User, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import WaitlistModal from "./WaitlistModal";
import PersonalColorQuizModal from "./PersonalColorQuizModal";

interface NavbarProps {
  onOpenSavedDrawer: () => void;
  onOpenQuiz?: () => void;
  onOpenClone?: () => void;
  onOpenCatalog?: () => void;
  onOpenHistory?: () => void;
}

export default function Navbar({ onOpenSavedDrawer, onOpenQuiz, onOpenClone, onOpenCatalog, onOpenHistory }: NavbarProps) {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [savedCount, setSavedCount] = useState<number>(0);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstallPWA = async () => {
    setToolsDropdownOpen(false);
    setMobileMenuOpen(false);
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    } else {
      alert(
        "📲 Cara Pasang Aplikasi look.u di Layar Utama HP:\n\n" +
        "• Di iPhone (Safari): Tekan tombol Bagikan (Share ⎋) di bawah layar ➔ pilih 'Tambahkan ke Layar Utama' (Add to Home Screen).\n\n" +
        "• Di Android (Chrome): Tekan menu titik tiga (⋮) di pojok kanan atas ➔ pilih 'Pasang Aplikasi' (Install App)."
      );
    }
  };

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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpenQuizModal = () => {
    setToolsDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onOpenQuiz) {
      onOpenQuiz();
    } else {
      setIsQuizOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8DFD1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Signature Boutique Logo: look.u */}
            <Link href="/" className="flex items-center gap-3 group">
              <span className="font-serif italic font-bold text-2xl sm:text-3xl tracking-tight text-[#181A18] group-hover:opacity-90 transition-opacity">
                look<span className="text-terracotta-500 not-italic">.</span>u
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#8A7A68] border-l border-[#D7CABC] pl-3 py-0.5">
                Edition 2026
              </span>
            </Link>

            {/* Clean Core Nav Links */}
            <nav className="hidden lg:flex items-center gap-8 text-[13px] tracking-wider uppercase font-semibold text-[#181A18]/75">
              <a
                href="#trending"
                className="hover:text-[#181A18] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1.5px] after:bg-[#181A18] after:transition-all"
              >
                Lookbook
              </a>
              <a
                href="#studio"
                className="hover:text-[#181A18] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1.5px] after:bg-[#181A18] after:transition-all"
              >
                Studio OOTD
              </a>
              <a
                href="#challenge"
                className="hover:text-terracotta-600 font-bold transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 hover:after:w-full after:h-[1.5px] after:bg-terracotta-500 after:transition-all flex items-center gap-1.5"
              >
                <span className="text-terracotta-500 text-xs">✦</span>
                <span>Challenge</span>
              </a>
            </nav>

            {/* Right Action Area: Dropdown Fitur + Lemari + VIP */}
            <div className="hidden md:flex items-center gap-3">
              {/* Studio Tools Popover Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                  className={`px-3.5 py-2 text-xs font-bold tracking-wider uppercase rounded-xl transition-all flex items-center gap-2 border ${
                    toolsDropdownOpen
                      ? "bg-charcoal-900 text-sand-50 border-charcoal-900 shadow-sm"
                      : "bg-white hover:bg-sand-100 text-charcoal-900 border-sand-300 shadow-2xs"
                  }`}
                  aria-expanded={toolsDropdownOpen}
                >
                  <div className="w-5 h-5 rounded-lg bg-terracotta-50 flex items-center justify-center border border-terracotta-200">
                    <Sparkles className="w-3 h-3 text-terracotta-600" />
                  </div>
                  <span>Fitur AI</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Popover Dropdown Panel */}
                <AnimatePresence>
                  {toolsDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-sand-300 shadow-2xl p-2.5 z-50 overflow-hidden"
                    >
                      <div className="px-3 py-2 border-b border-sand-100 mb-1">
                        <span className="text-[10px] font-mono uppercase font-bold text-sand-500 tracking-wider">
                          EKSPLORASI FITUR STUDIO
                        </span>
                      </div>

                      <div className="space-y-1">
                        {onOpenCatalog && (
                          <button
                            onClick={() => {
                              setToolsDropdownOpen(false);
                              onOpenCatalog();
                            }}
                            className="w-full px-3 py-2.5 rounded-xl hover:bg-sand-100 flex items-center gap-3 text-left transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                              <Store className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-charcoal-900 group-hover:text-terracotta-600 transition-colors">
                                Gudang 300+ Busana
                              </div>
                              <div className="text-[10px] text-sand-500">Katalog pakaian adem & brand lokal</div>
                            </div>
                          </button>
                        )}

                        {onOpenClone && (
                          <button
                            onClick={() => {
                              setToolsDropdownOpen(false);
                              onOpenClone();
                            }}
                            className="w-full px-3 py-2.5 rounded-xl hover:bg-sand-100 flex items-center gap-3 text-left transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                              <Camera className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-charcoal-900 group-hover:text-terracotta-600 transition-colors">
                                Clone Style Influencer
                              </div>
                              <div className="text-[10px] text-sand-500">Duplikasi formula gaya selebgram</div>
                            </div>
                          </button>
                        )}

                        {onOpenHistory && (
                          <button
                            onClick={() => {
                              setToolsDropdownOpen(false);
                              onOpenHistory();
                            }}
                            className="w-full px-3 py-2.5 rounded-xl hover:bg-sand-100 flex items-center gap-3 text-left transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                              <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-charcoal-900 group-hover:text-terracotta-600 transition-colors">
                                Riwayat Kurasi OOTD
                              </div>
                              <div className="text-[10px] text-sand-500">Lihat kembali formula tersimpan</div>
                            </div>
                          </button>
                        )}

                        <button
                          onClick={handleOpenQuizModal}
                          className="w-full px-3 py-2.5 rounded-xl hover:bg-sand-100 flex items-center gap-3 text-left transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
                            <Palette className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-charcoal-900 group-hover:text-terracotta-600 transition-colors">
                              Diagnostik Personal Color
                            </div>
                            <div className="text-[10px] text-sand-500">Tes warna urat nadi 60 detik</div>
                          </div>
                        </button>

                        <button
                          onClick={handleInstallPWA}
                          className="w-full px-3 py-2.5 rounded-xl hover:bg-sand-100 flex items-center gap-3 text-left transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                            <Smartphone className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-charcoal-900 group-hover:text-terracotta-600 transition-colors">
                              Pasang Aplikasi di HP
                            </div>
                            <div className="text-[10px] text-sand-500">Akses cepat tanpa perlu browser</div>
                          </div>
                        </button>
                      </div>

                      <div className="pt-2 mt-2 border-t border-sand-100 px-3 flex items-center justify-between text-[10px] font-mono text-sand-500">
                        <a
                          href="#manifesto"
                          onClick={() => setToolsDropdownOpen(false)}
                          className="hover:text-charcoal-900 flex items-center gap-1 py-1"
                        >
                          <BookOpen className="w-3 h-3" />
                          <span>Cara Kerja</span>
                        </a>
                        <a
                          href="#faq"
                          onClick={() => setToolsDropdownOpen(false)}
                          className="hover:text-charcoal-900 flex items-center gap-1 py-1"
                        >
                          <HelpCircle className="w-3 h-3" />
                          <span>FAQ</span>
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Lemari Koleksi */}
              {onOpenSavedDrawer && (
                <button
                  onClick={onOpenSavedDrawer}
                  className="px-3.5 py-2 text-xs font-bold tracking-wider uppercase rounded-xl bg-white hover:bg-sand-100 text-charcoal-900 border border-sand-300 transition-all flex items-center gap-2 shadow-2xs"
                  title="Buka Lemari Koleksi"
                >
                  <div className="w-5 h-5 rounded-lg bg-sand-100 flex items-center justify-center border border-sand-200">
                    <Bookmark className="w-3 h-3 text-terracotta-600" />
                  </div>
                  <span>Lemari</span>
                  {savedCount > 0 && (
                    <span className="bg-charcoal-900 text-white px-2 py-0.5 rounded-full text-[10px] font-mono font-bold">
                      {savedCount}
                    </span>
                  )}
                </button>
              )}

              {/* Profile Link */}
              <Link
                href="/profile"
                className="p-2 rounded-xl bg-white hover:bg-sand-100 border border-sand-300 text-charcoal-900 transition-colors flex items-center justify-center shadow-2xs"
                title="Profil Pengguna & Style DNA"
              >
                <User className="w-4 h-4 text-charcoal-900" />
              </Link>

              {/* High-Contrast Gold VIP CTA */}
              <button
                onClick={() => setIsWaitlistOpen(true)}
                className="px-4 py-2 text-xs font-extrabold tracking-wider uppercase rounded-xl bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 hover:from-amber-400 hover:to-amber-500 text-amber-950 border border-amber-500/40 transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>Akses VIP</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-amber-950 stroke-[2.5]" />
              </button>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="md:hidden flex items-center gap-2">
              {onOpenSavedDrawer && (
                <button
                  onClick={onOpenSavedDrawer}
                  className="p-2 text-[#181A18] hover:bg-[#E8DFD1]/50 rounded-xl transition-colors relative"
                  title="Lemari Koleksi"
                >
                  <Bookmark className="w-5 h-5 text-terracotta-600" />
                  {savedCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-terracotta-500" />
                  )}
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-[#181A18] hover:bg-[#E8DFD1]/50 rounded-xl transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-[#FAF8F5] border-b border-[#E8DFD1]"
            >
              <div className="px-5 py-6 space-y-4">
                {/* Core Navigation Links */}
                <div className="grid grid-cols-3 gap-2 pb-3 border-b border-sand-200">
                  <a
                    href="#trending"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-white border border-sand-200 text-center text-xs font-bold text-charcoal-900 uppercase"
                  >
                    Lookbook
                  </a>
                  <a
                    href="#studio"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-white border border-sand-200 text-center text-xs font-bold text-charcoal-900 uppercase"
                  >
                    Studio OOTD
                  </a>
                  <a
                    href="#challenge"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-white border border-sand-200 text-center text-xs font-bold text-terracotta-600 uppercase flex items-center justify-center gap-1"
                  >
                    <span>✦</span>
                    <span>Event</span>
                  </a>
                </div>

                {/* Feature Tiles */}
                <div className="space-y-2">
                  <div className="text-[10px] font-mono uppercase text-sand-500 font-bold">Fitur & Eksplorasi</div>

                  {onOpenCatalog && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenCatalog();
                      }}
                      className="w-full p-3 rounded-2xl bg-white hover:bg-sand-50 border border-sand-200 flex items-center justify-between text-left transition-colors group shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-charcoal-900 group-hover:text-terracotta-600 transition-colors">Gudang 300+ Busana</div>
                          <div className="text-[10px] text-sand-500">Katalog pakaian & brand lokal</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">300+ LOOK</span>
                        <ChevronRight className="w-4 h-4 text-sand-400 group-hover:text-charcoal-900 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  )}

                  {onOpenClone && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenClone();
                      }}
                      className="w-full p-3 rounded-2xl bg-white hover:bg-sand-50 border border-sand-200 flex items-center justify-between text-left transition-colors group shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                          <Camera className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-charcoal-900 group-hover:text-terracotta-600 transition-colors">Clone Style Selebgram</div>
                          <div className="text-[10px] text-sand-500">Dupe outfit under 200k</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">AI DUPE</span>
                        <ChevronRight className="w-4 h-4 text-sand-400 group-hover:text-charcoal-900 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  )}

                  <button
                    onClick={handleOpenQuizModal}
                    className="w-full p-3 rounded-2xl bg-white hover:bg-sand-50 border border-sand-200 flex items-center justify-between text-left transition-colors group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <Palette className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-charcoal-900 group-hover:text-terracotta-600 transition-colors">Tes Personal Color</div>
                        <div className="text-[10px] text-sand-500">Cek undertone warna kulit</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">60 DETIK</span>
                      <ChevronRight className="w-4 h-4 text-sand-400 group-hover:text-charcoal-900 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>

                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full p-3 rounded-2xl bg-sand-100 hover:bg-sand-200 border border-sand-300 flex items-center justify-between text-left transition-colors group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white text-charcoal-900 flex items-center justify-center shrink-0 border border-sand-200">
                        <User className="w-4 h-4 text-charcoal-900" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-charcoal-900 group-hover:text-terracotta-600 transition-colors">Profil & Style DNA</div>
                        <div className="text-[10px] text-sand-500">Statistik gaya & analitik kamu</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-bold text-charcoal-900 bg-white px-2 py-0.5 rounded-full border border-sand-300">XP STATS</span>
                      <ChevronRight className="w-4 h-4 text-sand-400 group-hover:text-charcoal-900 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>

                  <button
                    onClick={handleInstallPWA}
                    className="w-full p-3 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-between text-left transition-colors group shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-950 group-hover:text-emerald-800 transition-colors">📲 Install look.u App</div>
                        <div className="text-[10px] text-emerald-700">Pasang di Home Screen HP</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">APP FREE</span>
                      <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                </div>

                {/* Bottom Actions */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsWaitlistOpen(true);
                    }}
                    className="w-full py-3 text-xs font-bold tracking-wider uppercase rounded-xl bg-charcoal-900 text-white hover:bg-terracotta-500 transition-all text-center flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span>Akses VIP</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {isWaitlistOpen && (
        <WaitlistModal onClose={() => setIsWaitlistOpen(false)} />
      )}
      <PersonalColorQuizModal 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)} 
        onApplyResult={(skinToneId) => {
          console.log("Applied skin tone:", skinToneId);
          setIsQuizOpen(false);
          // Scroll to studio
          const studioEl = document.getElementById("studio");
          if (studioEl) studioEl.scrollIntoView({ behavior: "smooth" });
        }} 
      />
    </>
  );
}
