# 📋 Product Requirements Document (PRD) — look.u
## Product: look.u (AI Tropical Personal Stylist & Nusantara Personal Color Studio)
**Target Platform:** Mobile-First Web / Progressive Web App (PWA) • Desktop Responsive  
**Status:** Production Ready (100% Build Passing, 300 Curated Tropical Looks Ingested)

---

## 1. Product Vision & Value Proposition
`look.u` adalah platform kurasi dan sistem rekomendasi busana harian berbasis AI pertama yang didedikasikan secara khusus untuk iklim tropis Indonesia (33°C). Platform ini memecahkan masalah *Tropical Climate Mismatch* dan *Skin Tone Incompatibility* dengan menyelaraskan busana terhadap kenyamanan termal serat kain (ISO 9920/ASTM D737) dan rona warna kulit Nusantara.

---

## 2. Key Modules & Scope Delivered

| Modul | Status | Deskripsi Fungsional |
|:---|:---:|:---|
| **Studio Generator** | ✅ Live | Generator formula OOTD berbasis cuaca GPS, acara, anggaran, gender, dan hijab. |
| **Personal Color 60s Quiz** | ✅ Live | Kuis 3 pertanyaan non-invasif untuk mengidentifikasi 5 rona kulit Nusantara. |
| **300 Lookbook Feed** | ✅ Live | 300 setelan busana brand lokal (*120 Hijab, 90 Wanita, 90 Pria*) dengan filter multi-tag. |
| **Item-Centric Modular Card**| ✅ Live | Kartu 4 item mandiri dengan fitur *Smart Single-Item Switcher* dan *Shopee Deeplink*. |
| **Tomorrow OOTD Forecast** | ✅ Live | Widget simulasi cuaca besok dengan penilaian breathability rating >98%. |
| **Admin CMS Portal** | ✅ Live | Dashboard manajemen `/admin` dengan otentikasi PIN 2408 dan 1-klik import/export CSV. |
| **Instagram Story Exporter** | ✅ Live | Generator kanvas 9:16 resolusi tinggi untuk membagikan OOTD ke media sosial. |
| **Weekly Outfit Calendar** | ✅ Live | Matriks perencana busana 7 hari dengan sinkronisasi penyimpanan lokal. |

---

## 3. Data Specification: 300 Outfits Dataset
- **Format**: 30 atribut kolom terstandarisasi CMS Admin.
- **Brand Lokal Terverifikasi**: *Lozy Hijab, Buttonscarves, Ria Miranda, Zaskia Mecca, Cottonink, Shopatvelvet, Jiniso, Thenblank, This Is April, Erigo, Kasual ID, Tenue de Attire, Brodo, Ventela, Aerostreet.*
- **Keamanan Tautan**: Menggunakan formula pencarian kata kunci resmi Shopee (`https://shopee.co.id/search?keyword=...`) yang 100% bebas dari status kedaluwarsa/404.
- **Integritas Gambar**: Seluruh 300 tampilan utama terhubung ke CDN gambar beresolusi tinggi yang terverifikasi aktif (Status 200 OK).
