"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";

const DISMISS_KEY = "looku_research_banner_dismissed";
const SHOW_AFTER_MS = 60000; // give users a full minute to actually try the app first

/**
 * SUS questionnaire invitation for thesis usability testing.
 * Appears once, late, and stays dismissed — so it never interrupts first impressions.
 */
export default function ResearchBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;
    const timer = setTimeout(() => setIsVisible(true), SHOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-label="Undangan kuesioner usability"
          className="fixed bottom-24 lg:bottom-6 left-4 right-4 lg:left-auto lg:right-6 lg:w-[380px] z-[90]"
        >
          <div className="ds-card bg-white p-4 shadow-[var(--ds-elev-3)] flex items-start gap-3">
            <div className="flex-1">
              <div className="ds-eyebrow mb-1">Riset Usability · 2 Menit</div>
              <p className="text-[13px] text-charcoal-900 leading-snug">
                Sudah mencoba Look.u? Bantu kami dengan mengisi kuesioner singkat (SUS).
              </p>
              <Link
                href="/kuesioner"
                target="_blank"
                rel="noopener noreferrer"
                onClick={dismiss}
                className="ds-btn ds-btn-primary mt-3 !min-h-[36px] !px-5 !text-[10px]"
              >
                Isi Kuesioner
              </Link>
            </div>
            <button
              onClick={dismiss}
              aria-label="Tutup"
              className="w-9 h-9 -mr-1 -mt-1 inline-flex items-center justify-center rounded-full text-charcoal-900/50 hover:text-charcoal-900 hover:bg-black/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
