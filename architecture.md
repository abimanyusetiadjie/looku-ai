# 🏗️ System & Technical Architecture Document
## Project: look.u AI Platform
**Stack:** Next.js 14 (App Router) • TypeScript • Tailwind CSS • Framer Motion • Supabase (PostgreSQL + Auth + Storage) • Vercel Edge

---

## 1. High-Level Architecture Topology

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT TIER (Edge PWA / Mobile)                           │
│  • Next.js 14 App Router (React 18 Concurrent Islands)                                   │
│  • Local-First Caching Layer (IndexedDB / LocalStorage Capsule Wardrobe)                 │
│  • GPU Hardware-Accelerated Animation Pipeline (Framer Motion spring physics)           │
└────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                         │ HTTPS / WebSocket / Web Worker
                                         ▼
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│                               SERVERLESS & API EDGE RUNTIME                              │
│  ┌────────────────────────┐  ┌─────────────────────────┐  ┌───────────────────────────┐  │
│  │   /api/chat (Stylist)  │  │  /api/generate (Heuristic)│  │ /api/waitlist & Newsletter │ │
│  │   Streaming LLM Proxy  │  │  Multi-Factor Matrix     │  │ Rate-Limited Cloud RPC   │  │
│  └────────────────────────┘  └─────────────────────────┘  └───────────────────────────┘  │
└────────────────────────────────────────┬─────────────────────────────────────────────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
┌──────────────────────────────────────┐  ┌────────────────────────────────────────────────┐
│      SUPABASE DATABASE & STORAGE     │  │       AFFILIATE & MARKETPLACE PROXY PIPELINE   │
│  • PostgreSQL 15 (Row-Level Security)│  │  • Shopee Open Platform Universal Linker       │
│  • Cloud Wardrobe Synced Graph       │  │  • Tokopedia Branch / Deeplink Universal Proxy │
│  • Community Challenge Real-Time Bus │  │  • Anti-Bot Attribution Tracking Ledger        │
└──────────────────────────────────────┘  └────────────────────────────────────────────────┘
```

---

## 2. Multi-Tier AI Stylist Execution Engine

To achieve **instant response times (< 100ms)** while maintaining conversational depth, look.u uses a **Tri-Tier Hybrid AI Pipeline**:

### Tier 1: Sub-50ms Client/Edge Heuristic Matrix (`src/lib/ai-engine.ts`)
* Evaluates 6 input dimensions (`gender` × `isModestHijab` × `occasion` × `budgetTier` × `weather` × `skinTone`).
* Calculates weighted harmony scores across 16 core outfit archetypes in milliseconds with zero server cold-start.

### Tier 2: Generative LLM Stylist Agent (`src/app/api/chat/route.ts`)
* Powered by Google Gemini / Groq / OpenAI LLMs with custom `SYSTEM_STYLIST_CHAT_PROMPT`.
* Enforces the **Head-to-Toe 5-Point Formula**:
  1. *Atasan (Top)*: Breathable cut & tropical fabric spec.
  2. *Bawahan (Bottom)*: Loose fit & comfort rating.
  3. *Hijab / Outer*: Harmonious voal/ceruty matching.
  4. *Sepatu & Aksesoris*: Footwear and bag tone coordination.
  5. *Kata Kunci Belanja*: Precise Shopee/Tokopedia search queries.

### Tier 3: Client-Side Colorimetric Extractor
* Canvas-based color clustering extracting dominant HEX colors from user-uploaded flatlay photos without transmitting raw biometric photos to remote servers.

---

## 3. Data Flow & Local-First State Lifecycle

```
[ User Interaction ] 
       │
       ▼
[ Local-First State (Instant UI Render) ] ──> LocalStorage / React State (0ms Latency)
       │
       ├── (If User Logged In) ──> [ Supabase Optimistic Background RPC ]
       │                                     │
       │                                     ▼
       │                              [ PostgreSQL Database (RLS) ]
       │
       └── (If Outbound Shop Click) ──> [ Affiliate Attribution Telemetry ] ──> [ Marketplace Web/App ]
```

---

## 4. Mobile Performance & Code-Splitting Architecture

* **On-Demand Dynamic Modals**: Heavy modules (Canvas Story Exporter, Catalog 300 items, Personal Color Quiz) are loaded via `next/dynamic` with `ssr: false` only upon user click.
* **First Load JS Budget**: Hard ceiling at **< 200 kB** for initial bundle.
* **Viewport Containment**: Utilizing `.cv-auto` (`content-visibility: auto; contain-intrinsic-size: 1px 500px;`) for offscreen landing page sections (FAQ, Challenge, Footer) to eliminate initial layout rendering thrash.
* **GPU Fill-Rate Optimization**: Mobile blurs clamped to `<= 6px` with zero continuous infinite blur recalculation loops.

---

## 5. Security, Privacy & Edge Compliance

1. **Ephemeral Biometric Processing**: Live camera viewfinder operates strictly in client DOM memory; captured image data is converted into color vectors and instantly released from memory.
2. **PostgreSQL Row-Level Security (RLS)**: Users can only read, insert, update, or delete their own cloud wardrobe entries mapped to `auth.uid()`.
3. **Affiliate Link Sanitization**: Outbound marketplace links are constructed via strict query param encodings to prevent open-redirect vulnerabilities.
