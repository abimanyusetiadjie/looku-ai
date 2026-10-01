import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Theme Palette: Modest, Minimalist & Modern Boutique
    BG_COLOR = RGBColor(250, 248, 245)        # #FAF8F5 Warm Sand
    CARD_BG = RGBColor(255, 255, 255)         # #FFFFFF Crisp Pure White
    CARD_BORDER = RGBColor(232, 223, 209)     # #E8DFD1 Subtle Paper Border
    TEXT_DARK = RGBColor(24, 26, 24)          # #181A18 Deep Charcoal
    TEXT_MUTED = RGBColor(138, 122, 104)      # #8A7A68 Warm Taupe
    ACCENT_TERRA = RGBColor(186, 93, 56)      # #BA5D38 Terracotta Clay
    ACCENT_SAGE = RGBColor(85, 115, 82)       # #557352 Muted Sage
    ACCENT_BG_TERRA = RGBColor(251, 243, 239) # #FBF3EF Light Terracotta Tint
    ACCENT_BG_SAGE = RGBColor(245, 248, 245)  # #F5F8F5 Light Sage Tint

    def apply_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background() # no line

    def add_header(slide, badge_text, title_text, subtitle_text=""):
        # Category Badge Pill
        badge_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.55), Inches(3.2), Inches(0.35))
        badge_box.fill.solid()
        badge_box.fill.fore_color.rgb = ACCENT_BG_TERRA
        badge_box.line.color.rgb = ACCENT_TERRA
        badge_box.line.width = Pt(1)
        tf_b = badge_box.text_frame
        tf_b.word_wrap = False
        p_b = tf_b.paragraphs[0]
        p_b.text = badge_text.upper()
        p_b.font.size = Pt(9.5)
        p_b.font.bold = True
        p_b.font.name = "Calibri"
        p_b.font.color.rgb = ACCENT_TERRA
        p_b.alignment = PP_ALIGN.CENTER

        # Main Slide Title
        tb_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.95), Inches(11.7), Inches(0.7))
        tf_t = tb_title.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title_text
        p_t.font.size = Pt(22)
        p_t.font.bold = True
        p_t.font.name = "Georgia"
        p_t.font.color.rgb = TEXT_DARK

        if subtitle_text:
            p_sub = tf_t.add_paragraph()
            p_sub.text = subtitle_text
            p_sub.font.size = Pt(11)
            p_sub.font.name = "Calibri"
            p_sub.font.color.rgb = TEXT_MUTED
            p_sub.space_before = Pt(3)

    def add_footer(slide, slide_num):
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(7.0), Inches(11.733), Inches(0.35))
        tf = tb.text_frame
        tf.word_wrap = False
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = f"look.u AI • Proposal Capstone Project & Tugas Akhir 2026                                                                                           Slide {slide_num} / 10"
        p.font.size = Pt(8.5)
        p.font.name = "Calibri"
        p.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 1: COVER (MODEST, MINIMALIST & EDITORIAL)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    apply_bg(s1)

    # Decorative frame container
    frame = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.733), Inches(5.9))
    frame.fill.solid()
    frame.fill.fore_color.rgb = CARD_BG
    frame.line.color.rgb = CARD_BORDER
    frame.line.width = Pt(1.5)

    # Content box inside frame
    tb1 = s1.shapes.add_textbox(Inches(1.3), Inches(1.2), Inches(10.7), Inches(5.1))
    tf1 = tb1.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "PROPOSAL CAPSTONE PROJECT & TUGAS AKHIR 2026"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_TERRA
    p.font.name = "Calibri"

    p = tf1.add_paragraph()
    p.text = "look.u AI"
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.name = "Georgia"
    p.font.color.rgb = TEXT_DARK
    p.space_before = Pt(8)

    p = tf1.add_paragraph()
    p.text = "Rancang Bangun Sistem Rekomendasi Outfit Harian Berbasis Kecerdasan Buatan (AI) Menggunakan Analisis Personal Color dan Adaptasi Iklim Tropis"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.name = "Georgia"
    p.font.color.rgb = TEXT_DARK
    p.space_before = Pt(10)

    p = tf1.add_paragraph()
    p.text = "Solusi Cerdas Personalisasi Busana Harian Adaptif Iklim Panas Lembab & Ramah Busana Santun (Modest Fashion)"
    p.font.size = Pt(12)
    p.font.name = "Calibri"
    p.font.color.rgb = TEXT_MUTED
    p.space_before = Pt(8)

    # Divider bar
    p = tf1.add_paragraph()
    p.text = "—" * 38
    p.font.size = Pt(10)
    p.font.color.rgb = CARD_BORDER
    p.space_before = Pt(12)

    p = tf1.add_paragraph()
    p.text = "Disusun oleh: Tim Pengembang look.u AI (3 Anggota)  |  Fakultas / Program Studi Informatika & Sistem Informasi"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = TEXT_DARK
    p.font.name = "Calibri"
    p.space_before = Pt(6)

    # =========================================================================
    # SLIDE 2: STRUKTUR TIM & PEMBAGIAN TUGAS (3 ANGGOTA)
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    apply_bg(s2)
    add_header(s2, "Bagian 1: Identitas & Tim Proyek", "Struktur Tim Pengembang & Distribusi Tanggung Jawab", "Kolaborasi 3 anggota multidisiplin untuk menghasilkan luaran komprehensif (AI, UI/UX, dan Data/Evaluasi)")
    add_footer(s2, 2)

    roles = [
        {
            "member": "Anggota 1 (Project Lead)",
            "role": "AI & Engine Architect",
            "tag": "CORE AI & ALGORITHM",
            "color": ACCENT_TERRA,
            "bg_color": ACCENT_BG_TERRA,
            "tasks": [
                "Merancang arsitektur kecerdasan buatan & integrasi Generative AI (Gemini 2.5 Flash).",
                "Merumuskan Knowledge-Based Matrix untuk 5 undertone kulit Indonesia & sirkulasi kain.",
                "Mengembangkan Heuristic Fallback Engine lokal untuk keandalan sistem tanpa downtime.",
                "Mengawasi keselarasan metodologi penelitian dan pemenuhan luaran Capstone/TA."
            ]
        },
        {
            "member": "Anggota 2",
            "role": "UI/UX & Frontend Architect",
            "tag": "HCI & MOBILE-FIRST",
            "color": ACCENT_SAGE,
            "bg_color": ACCENT_BG_SAGE,
            "tasks": [
                "Merancang antarmuka pengguna berbasis Mobile-First Priority & Responsive Desktop Atelier.",
                "Mengimplementasikan komponen interaktif Next.js 14 & animasi ergonomis Framer Motion.",
                "Menerapkan standardisasi sentuh Apple HIG (≥44px) & optimasi virtual keyboard.",
                "Menyusun prototipe interaktif pengujian pengguna dan alur happy-path evaluasi."
            ]
        },
        {
            "member": "Anggota 3",
            "role": "Data Engineer & Evaluation QA",
            "tag": "DATASET & TESTING",
            "color": RGBColor(73, 88, 72),
            "bg_color": RGBColor(244, 246, 244),
            "tasks": [
                "Mengurasi & membersihkan dataset 300+ entitas busana lokal dan spesifikasi tekstil.",
                "Mengintegrasikan penyimpanan database cloud Supabase & sinkronisasi local storage.",
                "Menyusun instrumen kuesioner System Usability Scale (SUS) & menyebarkan ke responden.",
                "Melakukan analisis statistik data kuesioner dan uji keamanan/validasi form."
            ]
        }
    ]

    card_w = Inches(3.68)
    card_h = Inches(4.7)
    gap = Inches(0.34)
    start_x = Inches(0.8)
    top_y = Inches(1.95)

    for i, r in enumerate(roles):
        cx = start_x + i * (card_w + gap)
        c_box = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, top_y, card_w, card_h)
        c_box.fill.solid()
        c_box.fill.fore_color.rgb = CARD_BG
        c_box.line.color.rgb = CARD_BORDER
        c_box.line.width = Pt(1.2)

        tb = s2.shapes.add_textbox(cx + Inches(0.2), top_y + Inches(0.2), card_w - Inches(0.4), card_h - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = r["tag"]
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = r["color"]
        p.font.name = "Calibri"

        p = tf.add_paragraph()
        p.text = r["role"]
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.name = "Georgia"
        p.font.color.rgb = TEXT_DARK
        p.space_before = Pt(3)

        p = tf.add_paragraph()
        p.text = r["member"]
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_MUTED
        p.font.name = "Calibri"

        p = tf.add_paragraph()
        p.text = "—" * 20
        p.font.size = Pt(8)
        p.font.color.rgb = CARD_BORDER
        p.space_before = Pt(4)

        for task in r["tasks"]:
            p = tf.add_paragraph()
            p.text = f"• {task}"
            p.font.size = Pt(9.5)
            p.font.color.rgb = TEXT_DARK
            p.font.name = "Calibri"
            p.space_before = Pt(6)

    # =========================================================================
    # SLIDE 3: URGENSI PROJEK (PROBLEM STATEMENT)
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    apply_bg(s3)
    add_header(s3, "Bagian 2: Latar Belakang & Urgensi", "Urgensi Proyek: Mengapa Penelitian Ini Sangat Diperlukan?", "Tantangan nyata yang dihadapi masyarakat Indonesia dalam berpakaian sehari-hari")
    add_footer(s3, 3)

    problems = [
        {
            "num": "01",
            "title": "Decision Fatigue Pagi Hari",
            "sub": "Dilema 'Lemari Penuh Tapi Bingung'",
            "desc": "Rata-rata individu menghabiskan 15–20 menit setiap pagi hanya untuk memilih pakaian harian. Beban kognitif berulang ini memicu kelelahan mental (decision fatigue) sebelum jam kerja/kuliah dimulai."
        },
        {
            "num": "02",
            "title": "Tantangan Iklim Panas Lembab",
            "sub": "Suhu 33°C & Kelembapan >80%",
            "desc": "Indonesia memiliki iklim tropis ekstrem. Kesalahan pemilihan material (misal: poliester tebal tanpa sirkulasi) menyebabkan keringat berlebih, gerah, dan menurunkan kenyamanan serta produktivitas harian."
        },
        {
            "num": "03",
            "title": "Bias Sistem Fashion Global",
            "sub": "Ketiadaan Konteks Kulit & Modest Lokal",
            "desc": "Aplikasi global (Pinterest, Acloset, Stylebook) didesain untuk iklim 4 musim dan standar warna kulit Barat. Belum ada platform yang mengintegrasikan 5 ragam undertone kulit Indonesia dan busana muslim santun."
        }
    ]

    for i, p_item in enumerate(problems):
        cx = start_x + i * (card_w + gap)
        c_box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, top_y, card_w, card_h)
        c_box.fill.solid()
        c_box.fill.fore_color.rgb = CARD_BG
        c_box.line.color.rgb = CARD_BORDER
        c_box.line.width = Pt(1.2)

        tb = s3.shapes.add_textbox(cx + Inches(0.25), top_y + Inches(0.25), card_w - Inches(0.5), card_h - Inches(0.5))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = p_item["num"]
        p.font.size = Pt(28)
        p.font.bold = True
        p.font.name = "Georgia"
        p.font.color.rgb = ACCENT_TERRA

        p = tf.add_paragraph()
        p.text = p_item["title"]
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.name = "Georgia"
        p.font.color.rgb = TEXT_DARK
        p.space_before = Pt(6)

        p = tf.add_paragraph()
        p.text = p_item["sub"]
        p.font.size = Pt(9.5)
        p.font.bold = True
        p.font.color.rgb = ACCENT_SAGE
        p.font.name = "Calibri"

        p = tf.add_paragraph()
        p.text = p_item["desc"]
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_DARK
        p.font.name = "Calibri"
        p.space_before = Pt(10)

    # =========================================================================
    # SLIDE 4: KEPENTINGAN RISET (DATA, TREN & FENOMENA)
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    apply_bg(s4)
    add_header(s4, "Bagian 2: Latar Belakang & Urgensi", "Kepentingan Riset: Bukti Data, Tren Pasar & Fenomena", "Tiga kekuatan pendorong yang memperkuat relevansi topik penelitian di tingkat nasional")
    add_footer(s4, 4)

    trends = [
        {
            "tag": "TREN RISET KONSUMEN",
            "stat": "+340%",
            "title": "Booming Analisis Personal Color",
            "desc": "Pencarian tren diagnostik warna kulit melonjak drastis di Indonesia. Konsumen Gen Z & Milenial semakin menyadari bahwa warna pakaian yang keliru membuat rona wajah tampak kusam dan pucat secara visual."
        },
        {
            "tag": "PASAR DOMESTIK INDONESIA",
            "stat": "Rp 280 T",
            "title": "Pusat Modest Fashion Dunia",
            "desc": "Indonesia menjadi episentrum busana santun global. Tuntutan akan paduan pakaian santun (tidak terawang, siluet proporsional, dan material jilbab tegak anti-gerah) merupakan kebutuhan primer masyarakat."
        },
        {
            "tag": "PERILAKU E-COMMERCE",
            "stat": "68%",
            "title": "Masalah Dead Wardrobe & Salah Beli",
            "desc": "Data perilaku belanja menunjukkan 68% konsumen sering membeli pakaian online yang akhirnya tidak terpakai karena kesulitan memadukan warna dan tekstil dengan pakaian yang sudah ada di rumah."
        }
    ]

    for i, t_item in enumerate(trends):
        cx = start_x + i * (card_w + gap)
        c_box = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, top_y, card_w, card_h)
        c_box.fill.solid()
        c_box.fill.fore_color.rgb = CARD_BG
        c_box.line.color.rgb = CARD_BORDER
        c_box.line.width = Pt(1.2)

        tb = s4.shapes.add_textbox(cx + Inches(0.25), top_y + Inches(0.25), card_w - Inches(0.5), card_h - Inches(0.5))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = t_item["tag"]
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = ACCENT_TERRA
        p.font.name = "Calibri"

        p = tf.add_paragraph()
        p.text = t_item["stat"]
        p.font.size = Pt(32)
        p.font.bold = True
        p.font.name = "Georgia"
        p.font.color.rgb = ACCENT_SAGE
        p.space_before = Pt(4)

        p = tf.add_paragraph()
        p.text = t_item["title"]
        p.font.size = Pt(13.5)
        p.font.bold = True
        p.font.name = "Georgia"
        p.font.color.rgb = TEXT_DARK
        p.space_before = Pt(4)

        p = tf.add_paragraph()
        p.text = t_item["desc"]
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_DARK
        p.font.name = "Calibri"
        p.space_before = Pt(8)

    # =========================================================================
    # SLIDE 5: TUJUAN PENELITIAN & PROYEK
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    apply_bg(s5)
    add_header(s5, "Bagian 2: Latar Belakang & Urgensi", "Tujuan Penelitian & Sasaran Capstone Project", "Tiga sasaran strategis yang terukur untuk menjawab rumusan masalah secara ilmiah")
    add_footer(s5, 5)

    goals = [
        {
            "target": "TUJUAN UTAMA (ALGORITMA)",
            "title": "Membangun Recommender Engine Multi-Kriteria",
            "desc": "Merancang dan mengimplementasikan sistem rekomendasi cerdas yang memadukan input warna kulit (undertone), cuaca tropis panas lembab, tingkat formalitas acara, dan preferensi modest/hijab ke dalam formula paduan outfit yang harmonis."
        },
        {
            "target": "TUJUAN TERAPAN (SUSTAINABLE FASHION)",
            "title": "Memfasilitasi Pemanfaatan Lemari Pribadi",
            "desc": "Mengembangkan fitur Smart Wardrobe Mixer agar pengguna dapat memadukan pakaian yang telah dimiliki di lemari dengan kurasi pakaian pelengkap baru, mengurangi perilaku konsumtif dan memaksimalkan utility pakaian."
        },
        {
            "target": "TUJUAN EVALUATIF (PENGUJIAN EMPIRIS)",
            "title": "Menguji Kebergunaan Sistem dengan Standar SUS",
            "desc": "Mengevaluasi tingkat kebergunaan antarmuka pengguna dan akurasi rekomendasi kepada calon pengguna nyata melalui instrumen System Usability Scale (SUS) dengan target skor kelayakan ≥ 75 (kategori Good/Excellent)."
        }
    ]

    for i, g_item in enumerate(goals):
        cx = start_x + i * (card_w + gap)
        c_box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, top_y, card_w, card_h)
        c_box.fill.solid()
        c_box.fill.fore_color.rgb = CARD_BG
        c_box.line.color.rgb = CARD_BORDER
        c_box.line.width = Pt(1.2)

        tb = s5.shapes.add_textbox(cx + Inches(0.25), top_y + Inches(0.25), card_w - Inches(0.5), card_h - Inches(0.5))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = g_item["target"]
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = ACCENT_TERRA
        p.font.name = "Calibri"

        p = tf.add_paragraph()
        p.text = g_item["title"]
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.name = "Georgia"
        p.font.color.rgb = TEXT_DARK
        p.space_before = Pt(8)

        p = tf.add_paragraph()
        p.text = g_item["desc"]
        p.font.size = Pt(10.5)
        p.font.color.rgb = TEXT_DARK
        p.font.name = "Calibri"
        p.space_before = Pt(10)

    # =========================================================================
    # SLIDE 6: HASIL & LUARAN PROYEK (DELIVERABLES)
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    apply_bg(s6)
    add_header(s6, "Bagian 2: Latar Belakang & Urgensi", "Hasil & Luaran Proyek (Deliverables)", "Luaran nyata yang dihasilkan dalam aspek perangkat lunak, data terstruktur, dan akademis")
    add_footer(s6, 6)

    deliverables = [
        {
            "tag": "LUARAN PRODUK PERANGKAT LUNAK",
            "title": "Aplikasi Web Produksi 'look.u AI'",
            "points": [
                "Aplikasi web responsif (Next.js 14, Tailwind CSS, Framer Motion).",
                "Arsitektur Mobile-First & Desktop Atelier.",
                "22 rute terkompilasi bebas error (100% production build pass).",
                "Fitur Kuis Personal Color, Studio Racik, Garment Switcher, dan Lemari."
            ]
        },
        {
            "tag": "LUARAN BASIS DATA & ALGORITMA",
            "title": "Dataset & Matriks Pengetahuan Tekstil",
            "points": [
                "Dataset 300+ entitas katalog busana lokal dengan parameter kain.",
                "Matriks Seasonal Color Harmony untuk 5 skin tone Indonesia.",
                "Aturan filter sirkulasi kain tropis (katun, linen, rayon, crinkle).",
                "Skema database Supabase & fallback offline local storage engine."
            ]
        },
        {
            "tag": "LUARAN AKADEMIS & DOKUMENTASI",
            "title": "Laporan Tugas Akhir & Laporan Uji SUS",
            "points": [
                "Buku Laporan Capstone Project / Tugas Akhir lengkap.",
                "Kumpulan data mentah kuesioner evaluasi responden pengguna.",
                "Laporan analisis statistik skor System Usability Scale (SUS).",
                "Draf Naskah Artikel Ilmiah untuk publikasi jurnal/seminar nasional."
            ]
        }
    ]

    for i, d_item in enumerate(deliverables):
        cx = start_x + i * (card_w + gap)
        c_box = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, top_y, card_w, card_h)
        c_box.fill.solid()
        c_box.fill.fore_color.rgb = CARD_BG
        c_box.line.color.rgb = CARD_BORDER
        c_box.line.width = Pt(1.2)

        tb = s6.shapes.add_textbox(cx + Inches(0.25), top_y + Inches(0.25), card_w - Inches(0.5), card_h - Inches(0.5))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = d_item["tag"]
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = ACCENT_TERRA
        p.font.name = "Calibri"

        p = tf.add_paragraph()
        p.text = d_item["title"]
        p.font.size = Pt(13.5)
        p.font.bold = True
        p.font.name = "Georgia"
        p.font.color.rgb = TEXT_DARK
        p.space_before = Pt(6)

        p = tf.add_paragraph()
        p.text = "—" * 20
        p.font.size = Pt(8)
        p.font.color.rgb = CARD_BORDER
        p.space_before = Pt(4)

        for pt in d_item["points"]:
            p = tf.add_paragraph()
            p.text = f"✓ {pt}"
            p.font.size = Pt(10)
            p.font.color.rgb = TEXT_DARK
            p.font.name = "Calibri"
            p.space_before = Pt(6)

    # =========================================================================
    # SLIDE 7: METODE YANG DIGUNAKAN (METODOLOGI SISTEM)
    # =========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    apply_bg(s7)
    add_header(s7, "Bagian 3: Metodologi & Rencana Data", "Metodologi Penelitian & Arsitektur Sistem", "Kombinasi pendekatan User-Centered Design, Hybrid AI Engine, dan Evaluasi Standar SUS")
    add_footer(s7, 7)

    methods = [
        {
            "tag": "PENDEKATAN PENGEMBANGAN",
            "title": "User-Centered Design (UCD) & Agile",
            "desc": "Pengembangan perangkat lunak berulang melalui 5 fase: Empathize (analisis kebiasaan berpakaian) → Define (identifikasi masalah iklim & warna) → Ideate (arsitektur hybrid) → Prototype (Next.js 14) → Evaluate (kuesioner pengguna)."
        },
        {
            "tag": "ENGINE REKOMENDASI",
            "title": "Hybrid Knowledge-Based & Generative AI",
            "desc": "1. Aturan Pengetahuan: Filtering warna kulit & permeabilitas kain katun/linen secara deterministik.\n2. Generative AI: Gemini 2.5 Flash untuk narasi gaya dan tips hijab.\n3. Heuristic Engine: Cadangan instan jika API timeout."
        },
        {
            "tag": "METODE PENGUJIAN",
            "title": "System Usability Scale (SUS) & Likert",
            "desc": "1. SUS Framework: 10 pertanyaan standar untuk mengukur usability antarmuka secara objektif.\n2. Kuesioner Kepuasan AI: Skala Likert 1–5 mengukur relevansi warna personal, kesesuaian iklim, dan efisiensi waktu memilih pakaian."
        }
    ]

    for i, m_item in enumerate(methods):
        cx = start_x + i * (card_w + gap)
        c_box = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, cx, top_y, card_w, card_h)
        c_box.fill.solid()
        c_box.fill.fore_color.rgb = CARD_BG
        c_box.line.color.rgb = CARD_BORDER
        c_box.line.width = Pt(1.2)

        tb = s7.shapes.add_textbox(cx + Inches(0.25), top_y + Inches(0.25), card_w - Inches(0.5), card_h - Inches(0.5))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = m_item["tag"]
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = ACCENT_TERRA
        p.font.name = "Calibri"

        p = tf.add_paragraph()
        p.text = m_item["title"]
        p.font.size = Pt(13.5)
        p.font.bold = True
        p.font.name = "Georgia"
        p.font.color.rgb = TEXT_DARK
        p.space_before = Pt(6)

        p = tf.add_paragraph()
        p.text = m_item["desc"]
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_DARK
        p.font.name = "Calibri"
        p.space_before = Pt(8)

    # =========================================================================
    # SLIDE 8: DATA YANG DIGUNAKAN & SUMBER DATA
    # =========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    apply_bg(s8)
    add_header(s8, "Bagian 3: Metodologi & Rencana Data", "Data yang Digunakan & Klasifikasi Sumber Data", "Pemetaan variabel data sistem serta diferensiasi sumber data primer dan sekunder")
    add_footer(s8, 8)

    # Left Card: Data Structure (Width 5.6")
    box_l = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top_y, Inches(5.65), card_h)
    box_l.fill.solid()
    box_l.fill.fore_color.rgb = CARD_BG
    box_l.line.color.rgb = CARD_BORDER
    box_l.line.width = Pt(1.2)

    tb_l = s8.shapes.add_textbox(Inches(1.05), top_y + Inches(0.25), Inches(5.15), card_h - Inches(0.5))
    tf_l = tb_l.text_frame
    tf_l.word_wrap = True

    p = tf_l.paragraphs[0]
    p.text = "STRUKTUR DATA SISTEM"
    p.font.size = Pt(9)
    p.font.bold = True
    p.font.color.rgb = ACCENT_TERRA
    p.font.name = "Calibri"

    p = tf_l.add_paragraph()
    p.text = "Entitas Data yang Diolah look.u AI"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.name = "Georgia"
    p.font.color.rgb = TEXT_DARK
    p.space_before = Pt(4)

    items_l = [
        ("Data Personal Color", "5 Skin tone lokal (Putih Gading, Kuning Langsat, Sawo Matang, Eksotis, Deep Bronze) & 3 Undertone."),
        ("Data Katalog Pakaian (300+ Item)", "Atribut atasan, bawahan, hijab/outer, alas kaki, kode warna HEX, estimasi harga IDR, dan sirkulasi kain."),
        ("Data Parameter Iklim Tropis", "Tingkat sirkulasi udara serat tekstil (katun rayon, linen euro, crinkle airflow, voal ultrafine)."),
        ("Data Konteks Agenda & Acara", "Klasifikasi 6 agenda: Kuliah, Kantor, Hangout, Kondangan, Liburan, dan Santai.")
    ]
    for title, desc in items_l:
        p = tf_l.add_paragraph()
        p.text = f"• {title}: {desc}"
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_DARK
        p.font.name = "Calibri"
        p.space_before = Pt(8)

    # Right Card: Data Sources (Width 5.6")
    box_r = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.88), top_y, Inches(5.65), card_h)
    box_r.fill.solid()
    box_r.fill.fore_color.rgb = CARD_BG
    box_r.line.color.rgb = CARD_BORDER
    box_r.line.width = Pt(1.2)

    tb_r = s8.shapes.add_textbox(Inches(7.13), top_y + Inches(0.25), Inches(5.15), card_h - Inches(0.5))
    tf_r = tb_r.text_frame
    tf_r.word_wrap = True

    p = tf_r.paragraphs[0]
    p.text = "KLASIFIKASI SUMBER DATA"
    p.font.size = Pt(9)
    p.font.bold = True
    p.font.color.rgb = ACCENT_SAGE
    p.font.name = "Calibri"

    p = tf_r.add_paragraph()
    p.text = "Sumber Data Primer & Sekunder"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.name = "Georgia"
    p.font.color.rgb = TEXT_DARK
    p.space_before = Pt(4)

    items_r = [
        ("Data Primer (Masyarakat Pengguna)", "Hasil kuesioner evaluasi dari responden (mahasiswa & pekerja usia 18–35 tahun) setelah mencoba aplikasi secara langsung."),
        ("Data Sekunder (Industri Tekstil)", "Studi literatur permeabilitas udara serat alami tropis untuk ketahanan iklim panas lembab."),
        ("Data Sekunder (Teori Warna)", "Teori Seasonal Color Analysis internasional yang dikalibrasi ke spektrum melanin kulit Asia Tenggara."),
        ("Data Sekunder (Katalog E-Commerce)", "Spesifikasi model pakaian dan rentang harga realistik dari marketplace resmi Indonesia (Shopee & Tokopedia).")
    ]
    for title, desc in items_r:
        p = tf_r.add_paragraph()
        p.text = f"✓ {title}: {desc}"
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_DARK
        p.font.name = "Calibri"
        p.space_before = Pt(8)

    # =========================================================================
    # SLIDE 9: RENCANA PENYELESAIAN & PENGOLAHAN DATA
    # =========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    apply_bg(s9)
    add_header(s9, "Bagian 3: Metodologi & Rencana Data", "Rencana Penyelesaian Data & Roadmap Evaluasi Kuesioner", "Tahapan pengumpulan masukan responden dan validasi empiris untuk laporan Tugas Akhir")
    add_footer(s9, 9)

    steps = [
        {
            "stage": "TAHAP 1",
            "title": "Data Curation & Prep",
            "status": "SELESAI 100%",
            "desc": "Kurasi 300+ entitas katalog pakaian tropis, normalisasi kode warna, dan perumusan matriks personal color."
        },
        {
            "stage": "TAHAP 2",
            "title": "Deployment Prototipe",
            "status": "SIAP DILUNCURKAN",
            "desc": "Hosting web app produksi (22 rute bebas error) agar responden dapat mengakses langsung dari HP."
        },
        {
            "stage": "TAHAP 3",
            "title": "Pengujian Kuesioner",
            "status": "ON PROGRESS",
            "desc": "Penyebaran instrumen kuesioner System Usability Scale (SUS) kepada target minimal 30–50 responden."
        },
        {
            "stage": "TAHAP 4",
            "title": "Analisis Statistik",
            "status": "FINAL STAGE",
            "desc": "Perhitungan skor rata-rata SUS (target ≥ 75) dan penarikan kesimpulan ilmiah di laporan akhir."
        }
    ]

    s_width = Inches(2.72)
    s_gap = Inches(0.28)
    for i, st in enumerate(steps):
        sx = start_x + i * (s_width + s_gap)
        s_box = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, sx, top_y, s_width, card_h)
        s_box.fill.solid()
        s_box.fill.fore_color.rgb = CARD_BG
        s_box.line.color.rgb = CARD_BORDER
        s_box.line.width = Pt(1.2)

        tb_s = s9.shapes.add_textbox(sx + Inches(0.2), top_y + Inches(0.2), s_width - Inches(0.4), card_h - Inches(0.4))
        tf_s = tb_s.text_frame
        tf_s.word_wrap = True

        p = tf_s.paragraphs[0]
        p.text = st["stage"]
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = ACCENT_TERRA
        p.font.name = "Calibri"

        p = tf_s.add_paragraph()
        p.text = st["title"]
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.name = "Georgia"
        p.font.color.rgb = TEXT_DARK
        p.space_before = Pt(4)

        p = tf_s.add_paragraph()
        p.text = f"[{st['status']}]"
        p.font.size = Pt(8.5)
        p.font.bold = True
        p.font.color.rgb = ACCENT_SAGE
        p.font.name = "Calibri"
        p.space_before = Pt(2)

        p = tf_s.add_paragraph()
        p.text = "—" * 15
        p.font.size = Pt(8)
        p.font.color.rgb = CARD_BORDER
        p.space_before = Pt(4)

        p = tf_s.add_paragraph()
        p.text = st["desc"]
        p.font.size = Pt(10)
        p.font.color.rgb = TEXT_DARK
        p.font.name = "Calibri"
        p.space_before = Pt(8)

    # =========================================================================
    # SLIDE 10: PENUTUP & SESI DISKUSI (Q&A)
    # =========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    apply_bg(s10)

    f10 = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.733), Inches(5.9))
    f10.fill.solid()
    f10.fill.fore_color.rgb = CARD_BG
    f10.line.color.rgb = CARD_BORDER
    f10.line.width = Pt(1.5)

    tb10 = s10.shapes.add_textbox(Inches(1.5), Inches(1.8), Inches(10.333), Inches(4.0))
    tf10 = tb10.text_frame
    tf10.word_wrap = True

    p = tf10.paragraphs[0]
    p.text = "KESIMPULAN & PENUTUP"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ACCENT_TERRA
    p.font.name = "Calibri"
    p.alignment = PP_ALIGN.CENTER

    p = tf10.add_paragraph()
    p.text = "Terima Kasih"
    p.font.size = Pt(42)
    p.font.bold = True
    p.font.name = "Georgia"
    p.font.color.rgb = TEXT_DARK
    p.alignment = PP_ALIGN.CENTER
    p.space_before = Pt(6)

    p = tf10.add_paragraph()
    p.text = "look.u AI siap melangkah ke tahap pengujian empiris dan pengumpulan data kuesioner pengguna.\nKami sangat mengharapkan masukan, saran, dan arahan dari Bapak/Ibu Dosen Penguji."
    p.font.size = Pt(13)
    p.font.name = "Calibri"
    p.font.color.rgb = TEXT_MUTED
    p.alignment = PP_ALIGN.CENTER
    p.space_before = Pt(10)

    p = tf10.add_paragraph()
    p.text = "Sesi Tanya Jawab (Q&A) Dibuka"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.name = "Georgia"
    p.font.color.rgb = ACCENT_SAGE
    p.alignment = PP_ALIGN.CENTER
    p.space_before = Pt(16)

    # Save presentation
    output_path = r"c:\Users\abima\.gemini\antigravity\scratch\AI-OOTD\looku_presentation_ta.pptx"
    prs.save(output_path)
    print(f"Presentation saved successfully at: {output_path}")

if __name__ == "__main__":
    create_deck()
