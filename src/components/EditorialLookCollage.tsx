"use client";

import React from "react";
import { OutfitItem } from "@/lib/types";
import { getOptimizedImageUrl } from "@/lib/image-optimizer";

interface EditorialLookCollageProps {
  items?: OutfitItem[];
  heroImage?: string;
  title: string;
  isPriority?: boolean;
}

export default function EditorialLookCollage({
  items,
  heroImage,
  title,
  isPriority = false,
}: EditorialLookCollageProps) {
  // Filter items that have a valid name or image
  const validItems = (items || []).filter((it) => it && (it.name || it.imageUrl));

  // If less than 2 items, fallback to heroImage
  if (!validItems || validItems.length < 2) {
    const fallbackSrc = heroImage || validItems[0]?.imageUrl || "/fallback-garment.svg";
    return (
      <div className="relative w-full h-full bg-[#FAF8F5] overflow-hidden flex items-center justify-center">
        <img
          src={getOptimizedImageUrl(fallbackSrc, "feed")}
          alt={title}
          loading={isPriority ? "eager" : "lazy"}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/fallback-garment.svg";
          }}
          className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
        />
      </div>
    );
  }

  // Helper for item images
  const getItemImage = (it: OutfitItem, idx: number) => {
    return it.imageUrl || `/products/prod_real_${String(idx + 1).padStart(2, "0")}.jpg`;
  };

  const getItemCategoryLabel = (cat: string) => {
    if (cat === "atasan") return "ATASAN";
    if (cat === "bawahan") return "BAWAHAN";
    if (cat === "outer_hijab") return "HIJAB / OUTER";
    if (cat === "sepatu") return "SEPATU";
    return cat.toUpperCase();
  };

  // TWO ITEMS: 2-COLUMN SPLIT
  if (validItems.length === 2) {
    const topItem = validItems[0];
    const bottomItem = validItems[1];

    return (
      <div className="relative w-full h-full bg-[#EAE6DF] grid grid-cols-2 gap-0.5 p-0.5 overflow-hidden">
        {/* Slot 1: Atasan */}
        <div className="relative w-full h-full bg-[#FAF8F5] overflow-hidden flex items-center justify-center p-2.5">
          <img
            src={getOptimizedImageUrl(getItemImage(topItem, 0), "thumbnail")}
            alt={topItem.name}
            loading={isPriority ? "eager" : "lazy"}
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/fallback-garment.svg";
            }}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5">
            <span className="px-1.5 py-0.5 rounded-xs bg-[#181A18]/85 text-white text-[8px] font-mono font-bold tracking-wider uppercase backdrop-blur-xs">
              {topItem.brand || getItemCategoryLabel(topItem.category)}
            </span>
          </div>
        </div>

        {/* Slot 2: Bawahan */}
        <div className="relative w-full h-full bg-[#FAF8F5] overflow-hidden flex items-center justify-center p-2.5">
          <img
            src={getOptimizedImageUrl(getItemImage(bottomItem, 1), "thumbnail")}
            alt={bottomItem.name}
            loading={isPriority ? "eager" : "lazy"}
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/fallback-garment.svg";
            }}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5">
            <span className="px-1.5 py-0.5 rounded-xs bg-[#181A18]/85 text-white text-[8px] font-mono font-bold tracking-wider uppercase backdrop-blur-xs">
              {bottomItem.brand || getItemCategoryLabel(bottomItem.category)}
            </span>
          </div>
        </div>

        {/* Floating Mini Tag Badge */}
        <div className="absolute bottom-1.5 right-1.5 z-10">
          <span className="px-1.5 py-0.5 rounded-xs bg-white/90 text-[#8C5A3C] text-[8px] font-mono font-bold uppercase tracking-wider shadow-2xs border border-[#181A18]/10">
            2 Real Items
          </span>
        </div>
      </div>
    );
  }

  // THREE OR MORE ITEMS: ASYMMETRIC EDITORIAL GRID (Hero Left 58%, Stacked Right 42%)
  const heroItem = validItems[0];
  const secondItem = validItems[1];
  const thirdItem = validItems[2];

  return (
    <div className="relative w-full h-full bg-[#EAE6DF] grid grid-cols-12 gap-0.5 p-0.5 overflow-hidden">
      {/* Left Hero Piece: 7 Cols (58% width, Full Height) */}
      <div className="col-span-7 relative w-full h-full bg-[#FAF8F5] overflow-hidden flex items-center justify-center p-3">
        <img
          src={getOptimizedImageUrl(getItemImage(heroItem, 0), "thumbnail")}
          alt={heroItem.name}
          loading={isPriority ? "eager" : "lazy"}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/fallback-garment.svg";
          }}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-1.5 left-1.5 flex flex-col gap-0.5">
          <span className="px-1.5 py-0.5 rounded-xs bg-[#181A18]/85 text-white text-[8px] font-mono font-bold tracking-wider uppercase backdrop-blur-xs">
            {heroItem.brand || getItemCategoryLabel(heroItem.category)}
          </span>
          <span className="px-1 py-0.5 rounded-xs bg-[#8C5A3C] text-white text-[7px] font-mono font-bold tracking-wider uppercase w-fit">
            HERO
          </span>
        </div>
      </div>

      {/* Right Column: 5 Cols (Stacked 2 Slots) */}
      <div className="col-span-5 grid grid-rows-2 gap-0.5 w-full h-full">
        {/* Right Top: Second Piece (Bawahan) */}
        <div className="relative w-full h-full bg-[#FAF8F5] overflow-hidden flex items-center justify-center p-2">
          <img
            src={getOptimizedImageUrl(getItemImage(secondItem, 1), "thumbnail")}
            alt={secondItem.name}
            loading={isPriority ? "eager" : "lazy"}
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/fallback-garment.svg";
            }}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-1 left-1">
            <span className="px-1 py-0.5 rounded-xs bg-[#181A18]/85 text-white text-[7px] font-mono font-bold tracking-wider uppercase">
              {secondItem.brand || getItemCategoryLabel(secondItem.category)}
            </span>
          </div>
        </div>

        {/* Right Bottom: Third Piece (Hijab / Outer) */}
        <div className="relative w-full h-full bg-[#FAF8F5] overflow-hidden flex items-center justify-center p-2">
          <img
            src={getOptimizedImageUrl(getItemImage(thirdItem, 2), "thumbnail")}
            alt={thirdItem.name}
            loading={isPriority ? "eager" : "lazy"}
            decoding="async"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/fallback-garment.svg";
            }}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-1 left-1">
            <span className="px-1 py-0.5 rounded-xs bg-[#181A18]/85 text-white text-[7px] font-mono font-bold tracking-wider uppercase">
              {thirdItem.brand || getItemCategoryLabel(thirdItem.category)}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Mini Tag Badge */}
      <div className="absolute bottom-1.5 right-1.5 z-10">
        <span className="px-1.5 py-0.5 rounded-xs bg-white/95 text-[#8C5A3C] text-[8px] font-mono font-bold uppercase tracking-wider shadow-2xs border border-[#181A18]/10">
          3 Real Items
        </span>
      </div>
    </div>
  );
}
