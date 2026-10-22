# 🏗️ System & Technical Architecture Document
## Project: look.u — AI Tropical Personal Stylist Platform
**Framework:** Next.js 14 App Router • TypeScript • Tailwind CSS • Framer Motion • Supabase • Google Gemini AI • Vercel Edge

---

## 1. High-Level Architecture Topology

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT TIER (Edge PWA / Mobile-First)                     │
│  • Next.js 14 App Router (React Server & Client Components)                              │
│  • Local-First Caching Layer (LocalStorage Capsule Wardrobe & CMS Cache)                 │
│  • GPU Hardware-Accelerated Animation Pipeline (Framer Motion spring physics)           │
│  • Responsive Breakpoints (Mobile 360px-430px, Tablet, Desktop 1024px+)                 │
└────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                         │ HTTPS / Client Events
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                APPLICATION & REASONING TIER                              │
│  ┌────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ 1. DETERMINISTIC KNOWLEDGE-BASED ENGINE (src/lib/presets.ts)                       │  │
│  │    • ISO 9920 / ASTM D737 Thermal Permeability Filter (33°C Heat Index)            │  │
│  │    • Personal Color Matrix (5 Skin Tones: Fair, Light, Medium, Tan, Deep)           │  │
│  │    • Modest / Hijab Architecture Validator                                         │  │
│  │    • Smart Visual Packshot Resolver (src/lib/packshot-dictionary.ts)               │  │
│  └─────────────────────────────────────┬──────────────────────────────────────────────┘  │
│                                        │ Clean Filtered Context                          │
│  ┌─────────────────────────────────────▼──────────────────────────────────────────────┐  │
│  │ 2. GENERATIVE LLM REASONING AGENT (src/lib/ai-engine.ts & /api/chat)               │  │
│  │    • Google Gemini AI API (Gemini 2.5 Flash)                                       │  │
│  │    • Fashion Reasoning Synthesis ("Why It Works" & Occasion Context)               │  │
│  │    • Natural Hijab & Accessory Harmony Narrative Generator                         │  │
│  └────────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
┌──────────────────────────────────────┐  ┌────────────────────────────────────────────────┐
│         DATA PERSISTENCE TIER        │  │         COMMERCE & ASSET PIPELINE              │
│  • 300 Lookbook Dataset (JSON/CSV)   │  │  • Shopee Search Query Universal Linker        │
│  • Supabase PostgreSQL (Cloud Sync)  │  │  • Verified 1000 Pinterest CDN Pins (200 OK)   │
│  • Admin CMS LocalStorage Bus Engine │  │  • Clean Packshot Studio Asset Dictionary      │
└──────────────────────────────────────┘  └────────────────────────────────────────────────┘
```

---

## 2. Item-Centric Packshot Architecture

To prevent LLM hallucination of CDN image hashes and guarantee 100% active shopping links, `look.u` implements an **Item-Centric Modular Architecture**:

```
[SETELAN OOTD (Lookbook Entry)]
   ├── heroImage: Verified CDN High-Res Visual (Status 200 OK)
   ├── shopeeUrl: Fullset Search Deep-Link
   └── 4 Komponen Busana Satuan:
         ├── 1. Atasan (Top): Name + Material (ISO 9920) + Price + Shopee Search Link + Packshot
         ├── 2. Bawahan (Bottom): Name + Material (Rayon/Linen) + Price + Shopee Search Link + Packshot
         ├── 3. Outer / Hijab: Name + Material (Voal/Paris) + Price + Shopee Search Link + Packshot
         └── 4. Alas Kaki (Footwear): Name + Material (Canvas/Insole) + Price + Shopee Search Link + Packshot
```

Each item can be individually swapped via `[ ↻ Ganti Item ]` without reloading the page or invalidating the overall harmony score.

---

## 3. Dataset Distribution & Synchronization

- **Total Curated Looks**: 300 looks stored in `src/lib/lookbook-300.json` and `data/look_u 300 data.csv`.
- **Category Breakdown**:
  - `Hijab / Modest`: 120 Looks (40%)
  - `Wanita Modern`: 90 Looks (30%)
  - `Pria / Menswear`: 90 Looks (30%)
- **Admin CMS Data Ingestion**:
  - Automatically parses CSV and TSV (Tab-separated) with zero character corruption.
  - Supports instant export to Excel format (`.csv` with UTF-8 BOM).
