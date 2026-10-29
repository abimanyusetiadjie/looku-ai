"use client";

import React, { useState } from "react";
import { OutfitItem } from "@/lib/types";
import { getOptimizedImageUrl } from "@/lib/image-optimizer";
import { trackAffiliateClick } from "@/lib/affiliate";

interface ShopTheLookHotspotCanvasProps {
  image: string;
  title: string;
  items?: OutfitItem[];
  isPriority?: boolean;
  highlightedIndex?: number | null;
  onSelectIndex?: (idx: number) => void;
  className?: string;
  isModal?: boolean;
}

export default function ShopTheLookHotspotCanvas({
  image,
  title,
  items = [],
  isPriority = false,
  highlightedIndex = null,
  onSelectIndex,
  className = "",
  isModal = false,
}: ShopTheLookHotspotCanvasProps) {
  const [hoveredDotIdx, setHoveredDotIdx] = useState<number | null>(null);
  const [openTooltipIdx, setOpenTooltipIdx] = useState<number | null>(null);

  // Filter items that have real data
  const validItems = (items || []).filter(
    (it) => it && (it.name || it.imageUrl || it.estimatedPrice)
  );

  // Fallback image handling
  const [imgSrc, setImgSrc] = useState<string>(
    image || validItems[0]?.imageUrl || "/fallback-garment.svg"
  );

  // Smart coordinates based on fashion category
  const getCoordinates = (it: OutfitItem, idx: number) => {
    const cat = (it.category || "").toLowerCase();
    const name = (it.name || "").toLowerCase();

    if (
      cat.includes("hijab") ||
      name.includes("hijab") ||
      name.includes("pashmina") ||
      name.includes("bergo")
    ) {
      return { top: "18%", left: "50%", isRightSide: false };
    }
    if (
      cat.includes("atasan") ||
      name.includes("kemeja") ||
      name.includes("blouse") ||
      name.includes("shirt") ||
      name.includes("tunik") ||
      name.includes("kaos")
    ) {
      return { top: "36%", left: "44%", isRightSide: false };
    }
    if (
      cat.includes("outer") ||
      name.includes("cardigan") ||
      name.includes("blazer") ||
      name.includes("jaket") ||
      name.includes("vest")
    ) {
      return { top: "42%", left: "62%", isRightSide: true };
    }
    if (
      cat.includes("bawahan") ||
      name.includes("celana") ||
      name.includes("kulot") ||
      name.includes("jeans") ||
      name.includes("rok") ||
      name.includes("pants") ||
      name.includes("skirt")
    ) {
      return { top: "66%", left: "52%", isRightSide: false };
    }
    if (
      cat.includes("sepatu") ||
      name.includes("sneakers") ||
      name.includes("loafers") ||
      name.includes("heels") ||
      name.includes("sandal") ||
      name.includes("shoes")
    ) {
      return { top: "86%", left: "46%", isRightSide: false };
    }

    // Default distribution if uncategorized
    const defaults = [
      { top: "36%", left: "44%", isRightSide: false },
      { top: "66%", left: "52%", isRightSide: false },
      { top: "18%", left: "50%", isRightSide: false },
      { top: "86%", left: "46%", isRightSide: false },
    ];
    return defaults[idx % defaults.length];
  };

  return (
    <div
      className={`relative w-full h-full bg-[#EFECE6] overflow-hidden group select-none ${className}`}
    >
      {/* 100% SATU KESATUAN FOTO MODEL (ASPEK 4:5 VERTIKAL) */}
      <img
        src={getOptimizedImageUrl(imgSrc, isModal ? "detail" : "feed")}
        alt={title}
        loading={isPriority ? "eager" : "lazy"}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => {
          if (validItems[0]?.imageUrl && imgSrc !== validItems[0].imageUrl) {
            setImgSrc(validItems[0].imageUrl);
          } else {
            setImgSrc("/fallback-garment.svg");
          }
        }}
        className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
      />

      {/* VIGNETTE GRADIENT HALUS DI BAWAH UNTUK KONTRAST TEKS */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 opacity-60 pointer-events-none" />

      {/* INTERACTIVE HOTSPOTS (PINTEREST / INSTAGRAM SHOPPING STYLE) */}
      {validItems.map((it, idx) => {
        const coords = getCoordinates(it, idx);
        const isHighlighted = highlightedIndex === idx;
        const isHovered = hoveredDotIdx === idx;
        const isOpen = openTooltipIdx === idx;
        const showTooltip = isHighlighted || isHovered || isOpen;

        return (
          <div
            key={idx}
            className="absolute z-20"
            style={{ top: coords.top, left: coords.left }}
          >
            {/* Pulsing ring outer */}
            <span
              className={`absolute -inset-1.5 rounded-full bg-white/50 transition-opacity duration-300 pointer-events-none ${
                isHighlighted
                  ? "animate-ping opacity-90 scale-125"
                  : "animate-pulse opacity-60 group-hover:opacity-100"
              }`}
            />

            {/* Hotspot Dot Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpenTooltipIdx(isOpen ? null : idx);
                onSelectIndex?.(idx);
              }}
              onMouseEnter={() => setHoveredDotIdx(idx)}
              onMouseLeave={() => setHoveredDotIdx(null)}
              aria-label={`Hotspot produk ${it.name}`}
              className={`relative z-10 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg backdrop-blur-xs cursor-pointer ${
                isHighlighted || isHovered
                  ? "bg-[#D4A373] text-white scale-125 ring-2 ring-white"
                  : "bg-white/95 text-[#181A18] hover:scale-120 border border-[#181A18]/20"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full transition-colors ${
                  isHighlighted || isHovered ? "bg-white" : "bg-[#181A18]"
                }`}
              />
            </button>

            {/* Micro Popover Tooltip */}
            {showTooltip && (
              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute z-30 pointer-events-auto transition-all duration-200 ${
                  coords.isRightSide
                    ? "right-full mr-2.5"
                    : "left-full ml-2.5"
                } top-1/2 -translate-y-1/2 w-48 sm:w-56 p-2.5 rounded-xl bg-[#181A18]/95 text-white backdrop-blur-md shadow-2xl border border-white/15 text-left`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-[#D4A373] truncate">
                    {it.brand || it.category?.toUpperCase() || "CATALOG ITEM"}
                  </span>
                  {it.estimatedPrice && (
                    <span className="text-[9px] font-mono font-semibold text-white/90 shrink-0">
                      {it.estimatedPrice}
                    </span>
                  )}
                </div>

                <p className="text-[11px] font-medium leading-snug text-white line-clamp-2">
                  {it.name}
                </p>

                {it.material && (
                  <p className="text-[9px] text-white/60 line-clamp-1 mt-0.5">
                    {it.material}
                  </p>
                )}

                {it.shopeeUrl && (
                  <a
                    href={it.shopeeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.stopPropagation();
                      trackAffiliateClick(
                        "shopee",
                        it.shopeeQuery || it.name,
                        "outfit_card"
                      );
                    }}
                    className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EE4D2D] hover:bg-[#d44324] text-white text-[9px] font-mono font-bold uppercase tracking-wider transition-colors w-fit"
                  >
                    <span>Beli di Shopee ↗</span>
                  </a>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* FLOATING BADGE: SHOP THE LOOK PILL DI SUDUT KIRI BAWAH */}
      {validItems.length > 0 && (
        <div className="absolute bottom-2.5 left-2.5 z-10 pointer-events-none">
          <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[9px] font-mono tracking-wider flex items-center gap-1.5 border border-white/15 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4A373] animate-pulse" />
            <span className="font-semibold uppercase">Shop The Look</span>
            <span className="text-white/60">({validItems.length})</span>
          </div>
        </div>
      )}
    </div>
  );
}
