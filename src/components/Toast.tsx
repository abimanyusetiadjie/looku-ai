"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Bookmark, Info, X, AlertCircle } from "lucide-react";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: "success" | "save" | "info" | "curate" | "error";
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((t) =>
      setTimeout(() => {
        onDismiss(t.id);
      }, 3500)
    );
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts, onDismiss]);

  const getIcon = (type?: ToastMessage["type"]) => {
    switch (type) {
      case "save":
        return <Bookmark className="w-4 h-4 text-terracotta-500" />;
      case "curate":
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case "info":
        return <Info className="w-4 h-4 text-sand-300" />;
      case "success":
      default:
        return <Check className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getBorderAndGlow = (type?: ToastMessage["type"]) => {
    switch (type) {
      case "save":
        return "border-terracotta-500/40 shadow-[0_0_15px_rgba(217,99,71,0.15)]";
      case "curate":
        return "border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]";
      case "error":
        return "border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]";
      case "info":
        return "border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]";
      case "success":
      default:
        return "border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.15)]";
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:right-8 md:translate-x-0 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-[92vw] sm:w-auto">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-charcoal-900/95 text-sand-50 backdrop-blur-xl rounded-2xl shadow-2xl ${getBorderAndGlow(toast.type)} border`}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                {getIcon(toast.type)}
              </div>
              <div className="pr-2">
                <p className="text-xs font-bold font-serif tracking-tight text-white leading-tight">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="text-[10px] font-mono text-sand-300 mt-0.5 leading-tight">
                    {toast.description}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 text-white/50 hover:text-white rounded-lg transition-colors shrink-0"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
