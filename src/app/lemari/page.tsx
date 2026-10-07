"use client";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, X, Trash2, ChevronRight, Check } from "lucide-react";
import { OOTDRecommendation, OutfitItem } from "@/lib/types";
import { useWeather } from "@/hooks/useWeather";
import { computeBreathability } from "@/lib/breathability";
import { getMarketplaceLinks, trackAffiliateClick } from "@/lib/affiliate";
import Toast, { ToastMessage } from "@/components/Toast";

const STORAGE_KEY = "looku_saved_outfits";

// Starter pieces so a first-time user can try the canvas immediately.
const STARTER_ITEMS: OutfitItem[] = [
  { name: "Linen Crinkle Kulot", category: "bawahan", color: "Rose Pink", colorHex: "#D9A5A0", estimatedPrice: "Rp 150.000", material: "Linen Crinkle", imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80", shopeeQuery: "kulot linen crinkle wanita", tokopediaQuery: "kulot linen crinkle wanita" },
  { name: "Linen Shirt", category: "atasan", color: "Off White", colorHex: "#F3EFE6", estimatedPrice: "Rp 120.000", material: "Linen", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80", shopeeQuery: "kemeja linen wanita off white", tokopediaQuery: "kemeja linen wanita off white" },
  { name: "Cotton Hijab", category: "outer_hijab", color: "Natural", colorHex: "#D8C8AE", estimatedPrice: "Rp 85.000", material: "Katun Voal", imageUrl: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=400&q=80", shopeeQuery: "hijab voal katun natural", tokopediaQuery: "hijab voal katun natural" },
];

const HangerIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 4a2 2 0 1 0-2-2M12 4v3l-8.5 7.2c-.6.5-.3 1.3.5 1.3h16c.8 0 1.1-.8.5-1.3L12 7" />
  </svg>
);

function readSaved(): OOTDRecommendation[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

export default function WardrobePage() {
  const { weather } = useWeather();
  const [savedOutfits, setSavedOutfits] = useState<OOTDRecommendation[]>([]);
  const [boardItems, setBoardItems] = useState<OutfitItem[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showShopList, setShowShopList] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (t: Omit<ToastMessage, "id">) =>
    setToasts((prev) => [...prev, { ...t, id: Math.random().toString(36).slice(2, 9) }]);

  useEffect(() => {
    setIsClient(true);
    const sync = () => setSavedOutfits(readSaved());
    sync();
    window.addEventListener("looku_saved_updated", sync);
    return () => window.removeEventListener("looku_saved_updated", sync);
  }, []);

  // Unique pieces across all saved looks; padded with starter pieces when the closet is small.
  const { myItems, usingStarter } = useMemo(() => {
    const items: OutfitItem[] = [];
    savedOutfits.forEach((o) =>
      o.items.forEach((i) => {
        if (!items.some((e) => e.name === i.name)) items.push(i);
      })
    );
    if (items.length >= 3) return { myItems: items, usingStarter: false };
    const padded = [...items, ...STARTER_ITEMS.filter((s) => !items.some((i) => i.name === s.name))];
    return { myItems: padded, usingStarter: true };
  }, [savedOutfits]);

  const temperature = weather.temperature;
  const city = weather.isSimulated ? "Jakarta" : weather.location.charAt(0) + weather.location.slice(1).toLowerCase();
  const analysis = useMemo(() => computeBreathability(boardItems, temperature), [boardItems, temperature]);

  const isOnBoard = (item: OutfitItem) => boardItems.some((i) => i.name === item.name);

  const toggleOnBoard = (item: OutfitItem) => {
    setBoardItems((prev) =>
      prev.some((i) => i.name === item.name)
        ? prev.filter((i) => i.name !== item.name)
        : // one item per category keeps the flatlay realistic
          [...prev.filter((i) => i.category !== item.category), item]
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    try {
      const item: OutfitItem = JSON.parse(e.dataTransfer.getData("application/json"));
      if (!isOnBoard(item)) toggleOnBoard(item);
    } catch {
      /* ignore foreign drops */
    }
  };

  const lookTags = [
    `${temperature}°C`,
    analysis.score >= 85 ? "Breathable" : null,
    analysis.isModest ? "Hijab Friendly" : null,
  ].filter(Boolean) as string[];

  const handleSaveLook = () => {
    if (boardItems.length < 2) return;
    const newLook: OOTDRecommendation = {
      id: `mix-${Date.now()}`,
      title: `Mix & Match — ${boardItems.map((i) => i.name.split(" ")[0]).join(" + ")}`,
      tagline: analysis.verdict,
      overallVibe: "Personal Mix",
      comfortRating: Math.max(1, Math.round(analysis.score / 20)),
      affordabilityRating: 4,
      modestFriendly: analysis.isModest,
      skinToneMatch: "Dipadukan sendiri dari lemari",
      whyItWorks: `Breathable score ${analysis.score}% untuk ${temperature}°C. ${analysis.traits.join(", ")}.`,
      stylingTip: "Diracik di Mix & Match Canvas.",
      colorPalette: boardItems.map((i) => ({ name: i.color, hex: i.colorHex || "#C69365" })),
      items: boardItems,
      createdAt: new Date().toISOString(),
    };
    const updated = [newLook, ...readSaved()];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("looku_saved_updated"));
    addToast({ title: "Look tersimpan di Wardrobe", description: newLook.title, type: "save" });
  };

  const handleShare = async () => {
    if (boardItems.length === 0) return;
    const text =
      `Look.u Mix & Match (${city} ${temperature}°C · Breathable ${analysis.score}%)\n` +
      boardItems.map((i) => `• ${i.name} — ${i.color}`).join("\n") +
      `\n\nRacik look-mu sendiri: ${window.location.origin}/lemari`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Look.u Mix & Match", text });
      } else {
        await navigator.clipboard.writeText(text);
        addToast({ title: "Disalin ke clipboard", description: "Tempel di WhatsApp atau Instagram.", type: "success" });
      }
    } catch {
      /* user cancelled the share sheet */
    }
  };

  const handleDelete = (id: string, title: string) => {
    const updated = readSaved().filter((o) => o.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("looku_saved_updated"));
    addToast({ title: "Look dihapus", description: title, type: "info" });
  };

  if (!isClient) return null;

  const isEmpty = savedOutfits.length === 0;
  const canAct = boardItems.length >= 2;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--ds-sand)] text-charcoal-900 pb-28 lg:pb-16">
      <Navbar />

      {/* Header */}
      <div className="w-full pt-10 md:pt-12 pb-6 md:pb-8 px-5 lg:px-12 border-b border-charcoal-900">
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl uppercase tracking-tight mb-3">
          Wardrobe — Your Curated Closet.
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[var(--ds-ink-muted)]">
          <p className="text-[13px] tracking-wide">
            Dikurasi untuk {city} {temperature}°C · Breathable · Modest · {savedOutfits.length} look tersimpan
          </p>
          <div className="ds-badge !text-[10px] !px-3 !py-1.5 w-fit" title={weather.isSimulated ? "Lokasi tidak diizinkan — memakai data simulasi" : "Cuaca real-time"}>
            <span aria-hidden="true">🌤️</span> {city} {temperature}°C{weather.isSimulated ? " · SIM" : ""}
          </div>
        </div>
      </div>

      {isEmpty && (
        <section className="mt-10 mx-5 lg:mx-12 ds-card py-16 md:py-20 px-6 flex flex-col items-center text-center" aria-label="Wardrobe kosong">
          <div className="mb-5 text-charcoal-900"><HangerIcon /></div>
          <h2 className="font-serif text-2xl md:text-4xl mb-3">Lemarimu masih kosong, siap dikurasi untuk {temperature}°C.</h2>
          <p className="text-sm text-[var(--ds-ink-muted)] mb-8 max-w-md">
            Mulai dengan AI Stylist untuk menyusun look breathable pertamamu — atau coba kanvas di bawah dengan item contoh.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/studio" className="ds-btn ds-btn-primary">Mulai dengan AI Stylist</Link>
            <Link href="/lookbook" className="ds-btn ds-btn-secondary">Jelajahi Lookbook</Link>
          </div>
        </section>
      )}

      {/* Mix & Match */}
      <section className="mt-10 mx-5 lg:mx-12" aria-label="Mix and match">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* My items */}
          <div className="lg:col-span-5">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="ds-caption font-bold">My Items · {myItems.length}</h2>
              {usingStarter && <span className="ds-caption text-[var(--ds-ink-subtle)]">+ item contoh</span>}
            </div>
            <div className="flex lg:grid lg:grid-cols-3 gap-3 overflow-x-auto no-scrollbar pb-2 -mx-5 px-5 lg:mx-0 lg:px-0 snap-x">
              {myItems.map((item) => {
                const active = isOnBoard(item);
                return (
                  <button
                    key={item.name}
                    type="button"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("application/json", JSON.stringify(item))}
                    onClick={() => toggleOnBoard(item)}
                    aria-pressed={active}
                    className={`ds-card ds-card-interactive snap-start shrink-0 w-[150px] lg:w-auto p-2.5 text-left flex flex-col cursor-grab active:cursor-grabbing ${active ? "ring-2 ring-charcoal-900 ring-offset-2 ring-offset-[var(--ds-sand)]" : ""}`}
                  >
                    <div className="w-full aspect-square rounded-md overflow-hidden bg-black/5 mb-2.5">
                      <img src={item.imageUrl || "/fallback-garment.svg"} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-widest line-clamp-1">{item.name}</div>
                    <div className="ds-caption !text-[9px] text-[var(--ds-ink-muted)] mb-2">{item.color}</div>
                    <span className={`mt-auto inline-flex items-center justify-center gap-1 rounded-full border border-charcoal-900 py-1.5 text-[9px] font-bold uppercase tracking-widest ${active ? "bg-charcoal-900 text-white" : ""}`}>
                      {active ? <><Check className="w-3 h-3" /> Di kanvas</> : <><Plus className="w-3 h-3" /> Tap / drag</>}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-4">
            <h2 className="ds-caption font-bold mb-3">Mix & Match Canvas</h2>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              className={`ds-card p-4 min-h-[380px] flex flex-col transition-colors ${isDragOver ? "bg-white" : ""}`}
            >
              {boardItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center border border-dashed border-charcoal-900/25 rounded-lg p-6">
                  <p className="font-serif italic text-xl text-[var(--ds-ink-subtle)]">Tap atau seret item ke sini</p>
                  <p className="ds-caption text-[var(--ds-ink-subtle)] mt-2">Minimal 2 item untuk menyimpan look</p>
                </div>
              ) : (
                <div className={`flex-1 grid gap-3 ${boardItems.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
                  {boardItems.map((item) => (
                    <div key={item.name} className="relative rounded-lg overflow-hidden bg-white border border-[var(--ds-line)] aspect-square">
                      <img src={item.imageUrl || "/fallback-garment.svg"} alt={item.name} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => toggleOnBoard(item)}
                        aria-label={`Hapus ${item.name} dari kanvas`}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 border border-[var(--ds-line)] inline-flex items-center justify-center hover:bg-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-white/90 px-2 py-1 ds-caption !text-[9px] truncate">{item.name}</div>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {lookTags.map((t) => <span key={t} className="ds-badge">{t}</span>)}
              </div>
            </div>
          </div>

          {/* Actions + AI logic */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <h2 className="ds-caption font-bold">Actions</h2>
            <button type="button" onClick={handleSaveLook} disabled={!canAct} className="ds-btn ds-btn-primary w-full">Save Look</button>
            <button type="button" onClick={() => setShowShopList((v) => !v)} disabled={boardItems.length === 0} aria-expanded={showShopList} className="ds-btn ds-btn-secondary w-full">
              {showShopList ? "Tutup Daftar Belanja" : "Shop the Look"}
            </button>
            <button type="button" onClick={handleShare} disabled={boardItems.length === 0} className="ds-btn ds-btn-secondary w-full">Share Look</button>

            {showShopList && boardItems.length > 0 && (
              <div className="ds-card bg-white p-3 space-y-3">
                {boardItems.map((item) => {
                  const q = item.shopeeQuery || item.name;
                  const links = getMarketplaceLinks(q);
                  return (
                    <div key={item.name} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold"><span className="truncate pr-2">{item.name}</span><span className="font-mono text-[var(--ds-ink-muted)] shrink-0">{item.estimatedPrice}</span></div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <a href={links.shopee} target="_blank" rel="noopener noreferrer" onClick={() => trackAffiliateClick("shopee", q, "outfit_card")} className="ds-btn-marketplace ds-mp-shopee">Shopee</a>
                        <a href={links.tokopedia} target="_blank" rel="noopener noreferrer" onClick={() => trackAffiliateClick("tokopedia", q, "outfit_card")} className="ds-btn-marketplace ds-mp-tokopedia">Tokopedia</a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="ds-card p-4 mt-1" aria-live="polite">
              <div className="ds-caption font-bold border-b border-[var(--ds-line)] pb-2 mb-3">🌡️ Rekomendasi Suhu</div>
              {boardItems.length === 0 ? (
                <p className="text-[12px] text-[var(--ds-ink-muted)]">Tambahkan item untuk melihat skor breathability terhadap cuaca {city} hari ini.</p>
              ) : (
                <>
                  <div className="flex justify-between ds-caption font-bold mb-1">
                    <span>Breathable Score</span><span>{analysis.score}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden mb-3" role="progressbar" aria-valuenow={analysis.score} aria-valuemin={0} aria-valuemax={100}>
                    <div className="h-full bg-charcoal-900 rounded-full transition-all duration-500" style={{ width: `${analysis.score}%` }} />
                  </div>
                  {analysis.traits.length > 0 && (
                    <ul className="text-[11px] text-[var(--ds-ink-muted)] space-y-1 mb-3 list-disc pl-4">
                      {analysis.traits.map((t) => <li key={t}>{t}</li>)}
                    </ul>
                  )}
                  <p className="text-[12px] leading-relaxed border-t border-[var(--ds-line)] pt-3">
                    <span className="font-bold">AI:</span> {analysis.verdict}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Saved looks */}
      {!isEmpty && (
        <section className="mt-14 mx-5 lg:mx-12" aria-label="Look tersimpan">
          <h2 className="font-serif text-2xl md:text-3xl mb-5">Saved Looks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedOutfits.map((o) => (
              <article key={o.id} className="ds-card bg-white p-4 flex flex-col gap-3">
                <div className="flex gap-1.5">
                  {o.items.slice(0, 3).map((i) => (
                    <div key={i.name} className="flex-1 aspect-square rounded-md overflow-hidden bg-black/5">
                      <img src={i.imageUrl || "/fallback-garment.svg"} alt={i.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="ds-caption text-[var(--ds-ink-muted)]">{o.overallVibe || "Curated"}</div>
                  <h3 className="font-serif text-lg leading-snug line-clamp-2">{o.title}</h3>
                </div>
                <div className="mt-auto flex items-center justify-between pt-2 border-t border-[var(--ds-line)]">
                  <Link href={`/studio?look=${o.id}`} className="inline-flex items-center gap-1 min-h-[44px] text-[11px] font-bold uppercase tracking-widest hover:text-terracotta-600">
                    Buka di Studio <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <button type="button" onClick={() => handleDelete(o.id, o.title)} aria-label={`Hapus ${o.title}`} className="w-10 h-10 inline-flex items-center justify-center rounded-full text-[var(--ds-ink-muted)] hover:text-[var(--ds-error)] hover:bg-black/5">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <Toast toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
    </div>
  );
}
