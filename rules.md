# 📜 Engineering Standards & Anti-AI-Slop Governance Rules
## Project: look.u AI Platform
**Status:** Mandatory Coding & Design Standard for All Contributors & AI Agents

---

## 1. The Core Manifesto: "Human-Crafted Atelier Standards"

Every line of code, user-interface element, and piece of copy in look.u must reflect the taste, warmth, and discernment of a **high-end boutique fashion curator**. We strictly reject generic AI tropes, inflated metrics, and robotic terminology.

---

## 2. Rule 1: Strict Anti-AI-Slop Governance (Zero Tolerance)

```
┌────────────────────────────────────────────────────────┬────────────────────────────────────────────────────────┐
│ ❌ STRICTLY FORBIDDEN (AI SLOP)                         │ ✅ MANDATORY STANDARD (HUMAN ATELIER)                  │
├────────────────────────────────────────────────────────┼────────────────────────────────────────────────────────┤
│ • Fake decimal metrics ("98.4% Airflow", "88% Optimal")│ • Real fabric specifications ("100% Linen & Rayon")    │
│ • Stock photo avatar stacks claiming "14.800+ Users"   │ • Authentic trust badges ("Shopee Mall & Official")    │
│ • Database formula IDs ("FORMULA #F3A2")               │ • Editorial titles ("Look of the Day • Daily Casual")  │
│ • Robotic jargon ("Neural Heuristic Matrix")           │ • Lifestyle tone ("Kurasi Paduan Warna & Bahan Adem")  │
│ • AI buzzwords ("1-TAP ADJUST", "AI GENERATED")        │ • Human curation copy ("Pilihan Arah Gaya", "Curated") │
│ • Fruit salad badge stacking (5+ pills on one card)    │ • Clean visual hierarchy with maximum 1-2 discreet tags│
└────────────────────────────────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 3. Rule 2: Accessibility & Visual Contrast (WCAG 2.1 AAA)

1. **High-Contrast Text**: All subheadings and body paragraphs must maintain a contrast ratio of **>= 7:1** against Sand-Beige canvas backgrounds. Never use faint light-gray opacity for critical text.
2. **Gold & Amber Badging**: Never place white text on amber/gold backgrounds. VIP badges must strictly use dark brown/black typography (`text-amber-950 font-extrabold`).
3. **CTA Dominance (Hick's Law)**: Every page view must have **ONE primary solid action button** (e.g. `bg-charcoal-900 text-white`), with secondary options styled as clean outline buttons.

---

## 4. Rule 3: Mobile Performance & Resource Budget

1. **Bundle Ceiling**: First Load JavaScript must strictly remain **< 200 kB** on the landing page (`/`).
2. **On-Demand Dynamic Modals**: Any modal exceeding 10kB (e.g., Canvas Story Share, 300-Item Catalog, Personal Color Quiz) must use `next/dynamic` with `ssr: false` and render conditionally (`{isOpen && <Modal />}`).
3. **Zero GPU Fill-Rate Thrashing**:
   * No animated infinite `blur-3xl` (blur 64px) loops on mobile viewports.
   * Backdrop blur must be clamped to `<= 6px` on screens below 640px.
4. **Zero Layout Shift (CLS = 0)**: All image containers must specify aspect ratios (`aspect-square` or `aspect-[4/5]`) and background shimmer skeletons during loading.

---

## 5. Rule 4: Data Privacy & Ephemeral Processing

1. **Camera Viewfinder Stream**: Video frame analysis must occur strictly in client RAM. No raw facial or full-body user photographs may be transmitted to external servers without explicit cryptographic user consent.
2. **Row-Level Security (RLS)**: Any new Supabase table must have RLS enabled by default with explicit `auth.uid() = user_id` policies.
3. **Affiliate Transparency**: Outbound links must use transparent query parameters and clear marketplace logos (Shopee & Tokopedia).

---

## 6. Rule 5: Component Architecture & Code Cleanliness

1. **Client vs Server Isolation**: Mark components as `"use client"` only when utilizing React hooks, browser APIs, or Framer Motion animations.
2. **Type Strictness**: No `any` types permitted in production TypeScript modules.
3. **Dual Marketplace Parity**: Always maintain 50%-50% equal visual balance between Shopee and Tokopedia action buttons.
