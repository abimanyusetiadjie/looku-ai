import pandas as pd
import json
import random
import re
import os

# Set random seed for reproducible synthesis
random.seed(42)

# Load styles and images datasets
styles_path = "scratch/datasets/styles.csv"
images_path = "scratch/datasets/images.csv"

print("Loading styles.csv and images.csv...")
df_styles = pd.read_csv(styles_path, on_bad_lines='skip')
df_images = pd.read_csv(images_path)

# Extract integer ID from filename (e.g., '15970.jpg' -> 15970)
df_images['id'] = df_images['filename'].str.replace('.jpg', '', regex=False).astype(int, errors='ignore')

# Merge styles and images
df = pd.merge(df_styles, df_images, on='id', how='inner')
print(f"Total merged catalog rows: {len(df)}")

# Filter only Apparel and Footwear
df = df[df['masterCategory'].isin(['Apparel', 'Footwear'])]

# Exclude Indian traditional ethnic clothes that don't match Indonesian modern/tropical styles
EXCLUDED_TYPES = [
    'Kurtas', 'Kurtis', 'Dupatta', 'Patiala', 'Sarees', 'Churidar', 'Nehru Jackets',
    'Salwar', 'Lehenga Choli', 'Dhotis', 'Kurta Sets', 'Sherwani'
]
df = df[~df['articleType'].isin(EXCLUDED_TYPES)]
df = df[~df['productDisplayName'].str.contains('kurta|kurti|saree|ethnic|dupatta|churidar|lehenga', case=False, na=False)]

# Color Hex Mapping
COLOR_HEX_MAP = {
    "Black": "#181A18",
    "White": "#FAF8F5",
    "Blue": "#4A90E2",
    "Navy Blue": "#1B2A4A",
    "Grey": "#808080",
    "Brown": "#6E473B",
    "Beige": "#D4B996",
    "Cream": "#FFFDD0",
    "Olive": "#556B2F",
    "Green": "#2E7D32",
    "Pink": "#E0A899",
    "Red": "#C0392B",
    "Yellow": "#F1C40F",
    "Orange": "#E67E22",
    "Purple": "#8E44AD",
    "Maroon": "#800000",
    "Khaki": "#C2B280",
    "Rust": "#B7410E",
    "Peach": "#FFE5B4",
    "Charcoal": "#2B2B2B",
    "Multi": "#4A5568",
    "Off White": "#FAF6EE",
    "Tan": "#D2B48C",
    "Burgundy": "#6B1D2F",
    "Lavender": "#E6E6FA",
    "Turquoise Blue": "#00C5CD",
    "Teal": "#008080"
}

def get_color_hex(color_name):
    if not isinstance(color_name, str):
        return "#181A18"
    return COLOR_HEX_MAP.get(color_name.title(), COLOR_HEX_MAP.get(color_name, "#4A5568"))

def get_secure_image_url(url):
    if not isinstance(url, str):
        return "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600"
    return url.replace("http://", "https://")

# Fabrics by Article Type
FABRIC_MAP = {
    "Shirts": "100% Katun Oxford / Linen Breathable",
    "Tshirts": "Katun Combed 24s Cooltech Adem",
    "Tops": "Katun Rayon Twill / Crinkle Airflow",
    "Tunics": "Rayon Twill Premium Flowy",
    "Jackets": "Katun Twill Ringan / Semi-Wool",
    "Sweaters": "Fine Acrylic Breathable Knit",
    "Trousers": "Katun Twill Stretch 100% Breathable",
    "Jeans": "Denim Ringan 11oz Breathable",
    "Track Pants": "Poly-Cotton Dri-Fit Sejuk",
    "Skirts": "Poli-Cotton Flowy A-Line",
    "Casual Shoes": "Microfiber Leather & Breathable Insole",
    "Sports Shoes": "Knit Mesh Ultra-Breathable",
    "Formal Shoes": "Supple Microfiber Leather",
    "Heels": "Cushioned Vegan Leather",
    "Flats": "Soft Suede with Ortholite Insole"
}

HIJAB_OPTIONS = [
    {
        "name": "Pashmina Ceruty Baby Doll Premium",
        "material": "Ceruty Baby Doll Berpori Lembut",
        "color": "Soft Mocca",
        "colorHex": "#B8977E",
        "estimatedPrice": "Rp 35.000",
        "shopeeQuery": "pashmina ceruty baby doll",
        "tokopediaQuery": "pashmina ceruty baby doll"
    },
    {
        "name": "Hijab Segiempat Voal Ultrafine Laser Cut",
        "material": "100% Voal Ultrafine (Tegak Paripurna)",
        "color": "Cream Sand",
        "colorHex": "#FAEDCD",
        "estimatedPrice": "Rp 42.000",
        "shopeeQuery": "hijab voal ultrafine laser cut",
        "tokopediaQuery": "hijab voal ultrafine"
    },
    {
        "name": "Hijab Segiempat Paris Premium",
        "material": "Paris Premium Breathable",
        "color": "Broken White",
        "colorHex": "#FAF6EE",
        "estimatedPrice": "Rp 32.000",
        "shopeeQuery": "jilbab segi empat paris premium",
        "tokopediaQuery": "jilbab paris premium"
    },
    {
        "name": "Pashmina Silk Draped Shimmer",
        "material": "Silk Crinkle Airflow Mewah",
        "color": "Dusty Rose",
        "colorHex": "#D4A5A5",
        "estimatedPrice": "Rp 48.000",
        "shopeeQuery": "pashmina shimmer silk crinkle",
        "tokopediaQuery": "pashmina shimmer silk"
    },
    {
        "name": "Bergo Clean Look Daily Stretch",
        "material": "Jersey Soft Cooltech",
        "color": "Deep Charcoal",
        "colorHex": "#2B2B2B",
        "estimatedPrice": "Rp 38.000",
        "shopeeQuery": "bergo daily jersey clean look",
        "tokopediaQuery": "bergo jersey adem"
    }
]

# Separate Pools
men_tops = df[(df['gender'] == 'Men') & (df['subCategory'] == 'Topwear')].to_dict('records')
men_bottoms = df[(df['gender'] == 'Men') & (df['subCategory'] == 'Bottomwear')].to_dict('records')
men_shoes = df[(df['gender'] == 'Men') & (df['subCategory'] == 'Shoes')].to_dict('records')

women_tops = df[(df['gender'] == 'Women') & (df['subCategory'] == 'Topwear')].to_dict('records')
women_bottoms = df[(df['gender'] == 'Women') & (df['subCategory'] == 'Bottomwear')].to_dict('records')
women_shoes = df[(df['gender'] == 'Women') & (df['subCategory'] == 'Shoes')].to_dict('records')

print(f"Men pools: tops={len(men_tops)}, bottoms={len(men_bottoms)}, shoes={len(men_shoes)}")
print(f"Women pools: tops={len(women_tops)}, bottoms={len(women_bottoms)}, shoes={len(women_shoes)}")

def synthesize_500():
    print("Synthesizing 478 new OOTD formulas to reach exactly 500 total catalogs...")
    
    synthesized_presets = {}
    synthesized_trending = []
    
    # Target allocations:
    # 1. Hijab: 164 sets (with 6 signature = 170)
    # 2. Women Chic: 160 sets (with 10 signature = 170)
    # 3. Men: 154 sets (with 6 signature = 160)
    # Total = 170 + 170 + 160 = 500
    
    count_hijab = 0
    count_female = 0
    count_male = 0
    
    # -------------------------------------------------------------
    # 1. SYNTHESIZE 164 HIJAB / MODEST FORMULAS
    # -------------------------------------------------------------
    occasions_hijab = [
        ("Campus & Hijab", "Campus Modest", "Kuliah & Harian Kampus", "AIRY TROPICAL · OPTIMAL"),
        ("Work & Meeting", "Office Modest", "SCBD & Kantor Modern", "INDOOR AC / EVENING"),
        ("Weekend & Cafe", "Weekend Modest", "Kafe & Hangout Santai", "AIRY TROPICAL · OPTIMAL"),
        ("Reception & Pesta", "Formal Modest", "Kondangan & Acara Resmi", "INDOOR AC / EVENING")
    ]
    
    for i in range(164):
        occ = occasions_hijab[i % len(occasions_hijab)]
        top = random.choice(women_tops)
        bottom = random.choice(women_bottoms)
        shoe = random.choice(women_shoes)
        hijab = random.choice(HIJAB_OPTIONS)
        
        idx = i + 1
        preset_id = f"pa_hijab_{idx:03d}"
        look_id = f"look_pa_h_{idx:03d}"
        
        # Color swatches from real product baseColours
        top_color = str(top.get('baseColour', 'Sage'))
        bottom_color = str(bottom.get('baseColour', 'Sand'))
        hijab_color = hijab['color']
        
        swatches = [
            {"name": top_color, "hex": get_color_hex(top_color)},
            {"name": bottom_color, "hex": get_color_hex(bottom_color)},
            {"name": hijab_color, "hex": hijab['colorHex']}
        ]
        
        top_name = str(top.get('productDisplayName', 'Blouse Katun Flowy'))
        bottom_name = str(bottom.get('productDisplayName', 'Celana Kulot Loose'))
        shoe_name = str(shoe.get('productDisplayName', 'Casual Shoes'))
        
        top_art = str(top.get('articleType', 'Tops'))
        bottom_art = str(bottom.get('articleType', 'Trousers'))
        shoe_art = str(shoe.get('articleType', 'Casual Shoes'))
        
        top_price = random.randint(89, 149) * 1000
        bottom_price = random.randint(109, 189) * 1000
        shoe_price = random.randint(149, 269) * 1000
        hijab_price = int(re.sub(r'[^\d]', '', hijab['estimatedPrice']))
        
        total_min = (top_price + bottom_price + shoe_price + hijab_price) // 1000
        total_max = total_min + random.randint(45, 90)
        price_range = f"Rp {total_min}rb - {total_max}rb"
        
        title = f"{top_name.split()[0]} {bottom_name.split()[0]} {occ[1]} #{idx:02d}"
        
        items = [
            {
                "category": "outer_hijab",
                "name": hijab['name'],
                "material": hijab['material'],
                "color": hijab['color'],
                "colorHex": hijab['colorHex'],
                "estimatedPrice": hijab['estimatedPrice'],
                "shopeeQuery": hijab['shopeeQuery'],
                "tokopediaQuery": hijab['tokopediaQuery'],
                "imageUrl": "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=600"
            },
            {
                "category": "atasan",
                "name": top_name,
                "material": FABRIC_MAP.get(top_art, "Katun Rayon Twill Berpori Sejuk"),
                "color": top_color,
                "colorHex": get_color_hex(top_color),
                "estimatedPrice": f"Rp {top_price:,}".replace(",", "."),
                "shopeeQuery": f"{top_name.lower()[:35]} wanita",
                "tokopediaQuery": f"{top_name.lower()[:35]} adem",
                "imageUrl": get_secure_image_url(top.get('link'))
            },
            {
                "category": "bawahan",
                "name": bottom_name,
                "material": FABRIC_MAP.get(bottom_art, "Poli-Cotton Flowy Longgar"),
                "color": bottom_color,
                "colorHex": get_color_hex(bottom_color),
                "estimatedPrice": f"Rp {bottom_price:,}".replace(",", "."),
                "shopeeQuery": f"{bottom_name.lower()[:35]} wanita",
                "tokopediaQuery": f"{bottom_name.lower()[:35]} loose",
                "imageUrl": get_secure_image_url(bottom.get('link'))
            },
            {
                "category": "sepatu",
                "name": shoe_name,
                "material": FABRIC_MAP.get(shoe_art, "Microfiber Breathable Shoes"),
                "color": str(shoe.get('baseColour', 'Neutral')),
                "colorHex": get_color_hex(str(shoe.get('baseColour', 'Neutral'))),
                "estimatedPrice": f"Rp {shoe_price:,}".replace(",", "."),
                "shopeeQuery": f"{shoe_name.lower()[:35]}",
                "tokopediaQuery": f"{shoe_name.lower()[:35]}",
                "imageUrl": get_secure_image_url(shoe.get('link'))
            }
        ]
        
        preset = {
            "id": preset_id,
            "title": title,
            "tagline": f"Kombinasi santun dan sejuk untuk {occ[2]} di cuaca tropis 33°C.",
            "overallVibe": f"{occ[0]} · {top_color} & {bottom_color}",
            "comfortRating": round(random.uniform(4.8, 5.0), 1),
            "affordabilityRating": round(random.uniform(4.6, 4.9), 1),
            "modestFriendly": True,
            "skinToneMatch": f"Harmonis untuk warna kulit Sawo Matang & Kuning Langsat dengan aksen {top_color}.",
            "whyItWorks": f"Potongan loose fit {items[1]['material']} menjamin sirkulasi udara optimal tanpa rasa gerah.",
            "stylingTip": "Tuck-in seimbang pada atasan untuk memberi ilusi kaki jenjang bersama pashmina senada.",
            "colorPalette": swatches,
            "items": items,
            "createdAt": "2026-10-15T00:00:00.000Z"
        }
        
        synthesized_presets[preset_id] = preset
        synthesized_trending.append({
            "id": look_id,
            "title": title,
            "vibe": occ[1],
            "tag": "MODEST CAPSULE",
            "category": occ[0],
            "skinToneRecommendation": "Sawo Matang & Kuning Langsat",
            "priceRange": f"{price_range} / Set",
            "image": get_secure_image_url(top.get('link')),
            "likes": random.randint(340, 1560),
            "outfit": preset
        })
        count_hijab += 1
        
    # -------------------------------------------------------------
    # 2. SYNTHESIZE 160 WOMEN NON-HIJAB / CHIC FORMULAS
    # -------------------------------------------------------------
    occasions_women = [
        ("Weekend & Cafe", "Parisian Chic", "Cafe Hopping & Weekend", "AIRY TROPICAL · OPTIMAL"),
        ("Work & Meeting", "Smart Corporate", "Kantor & Presentasi", "INDOOR AC / EVENING"),
        ("Reception & Pesta", "Cocktail Luxe", "Pesta & Dinner Formal", "INDOOR AC / EVENING"),
        ("Streetwear", "Minimalist Street", "Eksplorasi Kota & Hangout", "AIRY TROPICAL · OPTIMAL"),
        ("Travel", "Resort Casual", "Liburan Tropis & Pantai", "AIRY TROPICAL · OPTIMAL")
    ]
    
    for i in range(160):
        occ = occasions_women[i % len(occasions_women)]
        top = random.choice(women_tops)
        bottom = random.choice(women_bottoms)
        shoe = random.choice(women_shoes)
        
        idx = i + 1
        preset_id = f"pa_female_{idx:03d}"
        look_id = f"look_pa_f_{idx:03d}"
        
        top_color = str(top.get('baseColour', 'White'))
        bottom_color = str(bottom.get('baseColour', 'Black'))
        shoe_color = str(shoe.get('baseColour', 'Tan'))
        
        swatches = [
            {"name": top_color, "hex": get_color_hex(top_color)},
            {"name": bottom_color, "hex": get_color_hex(bottom_color)},
            {"name": shoe_color, "hex": get_color_hex(shoe_color)}
        ]
        
        top_name = str(top.get('productDisplayName', 'Summer Top'))
        bottom_name = str(bottom.get('productDisplayName', 'Chic Bottom'))
        shoe_name = str(shoe.get('productDisplayName', 'Heels / Flats'))
        
        top_art = str(top.get('articleType', 'Tops'))
        bottom_art = str(bottom.get('articleType', 'Trousers'))
        shoe_art = str(shoe.get('articleType', 'Casual Shoes'))
        
        top_price = random.randint(99, 169) * 1000
        bottom_price = random.randint(119, 199) * 1000
        shoe_price = random.randint(159, 299) * 1000
        
        total_min = (top_price + bottom_price + shoe_price) // 1000
        total_max = total_min + random.randint(40, 80)
        price_range = f"Rp {total_min}rb - {total_max}rb"
        
        title = f"{top_name.split()[0]} {bottom_name.split()[0]} {occ[1]} #{idx:02d}"
        
        items = [
            {
                "category": "atasan",
                "name": top_name,
                "material": FABRIC_MAP.get(top_art, "Katun Sejuk Bernapas"),
                "color": top_color,
                "colorHex": get_color_hex(top_color),
                "estimatedPrice": f"Rp {top_price:,}".replace(",", "."),
                "shopeeQuery": f"{top_name.lower()[:35]} wanita",
                "tokopediaQuery": f"{top_name.lower()[:35]} wanita",
                "imageUrl": get_secure_image_url(top.get('link'))
            },
            {
                "category": "bawahan",
                "name": bottom_name,
                "material": FABRIC_MAP.get(bottom_art, "Linen / Katun Twill Dingin"),
                "color": bottom_color,
                "colorHex": get_color_hex(bottom_color),
                "estimatedPrice": f"Rp {bottom_price:,}".replace(",", "."),
                "shopeeQuery": f"{bottom_name.lower()[:35]} wanita",
                "tokopediaQuery": f"{bottom_name.lower()[:35]}",
                "imageUrl": get_secure_image_url(bottom.get('link'))
            },
            {
                "category": "sepatu",
                "name": shoe_name,
                "material": FABRIC_MAP.get(shoe_art, "Cushioned Leather Insole"),
                "color": shoe_color,
                "colorHex": get_color_hex(shoe_color),
                "estimatedPrice": f"Rp {shoe_price:,}".replace(",", "."),
                "shopeeQuery": f"{shoe_name.lower()[:35]}",
                "tokopediaQuery": f"{shoe_name.lower()[:35]}",
                "imageUrl": get_secure_image_url(shoe.get('link'))
            }
        ]
        
        preset = {
            "id": preset_id,
            "title": title,
            "tagline": f"Karakter siluet modern fotogenik untuk {occ[2]}.",
            "overallVibe": f"{occ[0]} · {top_color} & {bottom_color}",
            "comfortRating": round(random.uniform(4.7, 5.0), 1),
            "affordabilityRating": round(random.uniform(4.5, 4.9), 1),
            "modestFriendly": False,
            "skinToneMatch": f"Memberi kilau radiant pada kulit Kuning Langsat & Putih Gading.",
            "whyItWorks": f"Siluet bersih bahan {items[0]['material']} menciptakan aura Parisian effortlessly chic.",
            "stylingTip": "Lengkapi dengan tas pundak bertekstur netral dan kacamata berbingkai tipis.",
            "colorPalette": swatches,
            "items": items,
            "createdAt": "2026-10-15T00:00:00.000Z"
        }
        
        synthesized_presets[preset_id] = preset
        synthesized_trending.append({
            "id": look_id,
            "title": title,
            "vibe": occ[1],
            "tag": "CHIC CAPSULE",
            "category": occ[0],
            "skinToneRecommendation": "Kuning Langsat & Putih Gading",
            "priceRange": f"{price_range} / Set",
            "image": get_secure_image_url(top.get('link')),
            "likes": random.randint(450, 1680),
            "outfit": preset
        })
        count_female += 1
        
    # -------------------------------------------------------------
    # 3. SYNTHESIZE 154 MEN MENSWEAR FORMULAS
    # -------------------------------------------------------------
    occasions_men = [
        ("Work & Meeting", "Clean Menswear", "Kantor & Business Meeting", "INDOOR AC / EVENING"),
        ("Weekend & Cafe", "Casual Nomad", "Kafe, Weekend & Santai", "AIRY TROPICAL · OPTIMAL"),
        ("Streetwear", "Boxy Streetwear", "Urban Blok M & Hangout", "AIRY TROPICAL · OPTIMAL"),
        ("Travel", "Resort Linen", "Pantai & Tropical Holiday", "AIRY TROPICAL · OPTIMAL"),
        ("Reception & Pesta", "Formal Heritage", "Acara Resmi & Formal", "INDOOR AC / EVENING")
    ]
    
    for i in range(154):
        occ = occasions_men[i % len(occasions_men)]
        top = random.choice(men_tops)
        bottom = random.choice(men_bottoms)
        shoe = random.choice(men_shoes)
        
        idx = i + 1
        preset_id = f"pa_male_{idx:03d}"
        look_id = f"look_pa_m_{idx:03d}"
        
        top_color = str(top.get('baseColour', 'Navy Blue'))
        bottom_color = str(bottom.get('baseColour', 'Khaki'))
        shoe_color = str(shoe.get('baseColour', 'Brown'))
        
        swatches = [
            {"name": top_color, "hex": get_color_hex(top_color)},
            {"name": bottom_color, "hex": get_color_hex(bottom_color)},
            {"name": shoe_color, "hex": get_color_hex(shoe_color)}
        ]
        
        top_name = str(top.get('productDisplayName', 'Oxford Shirt'))
        bottom_name = str(bottom.get('productDisplayName', 'Chino Trousers'))
        shoe_name = str(shoe.get('productDisplayName', 'Loafers / Sneakers'))
        
        top_art = str(top.get('articleType', 'Shirts'))
        bottom_art = str(bottom.get('articleType', 'Trousers'))
        shoe_art = str(shoe.get('articleType', 'Casual Shoes'))
        
        top_price = random.randint(119, 189) * 1000
        bottom_price = random.randint(139, 219) * 1000
        shoe_price = random.randint(179, 319) * 1000
        
        total_min = (top_price + bottom_price + shoe_price) // 1000
        total_max = total_min + random.randint(45, 85)
        price_range = f"Rp {total_min}rb - {total_max}rb"
        
        title = f"{top_name.split()[0]} {bottom_name.split()[0]} {occ[1]} #{idx:02d}"
        
        items = [
            {
                "category": "atasan",
                "name": top_name,
                "material": FABRIC_MAP.get(top_art, "100% Katun Oxford Sejuk"),
                "color": top_color,
                "colorHex": get_color_hex(top_color),
                "estimatedPrice": f"Rp {top_price:,}".replace(",", "."),
                "shopeeQuery": f"{top_name.lower()[:35]} pria",
                "tokopediaQuery": f"{top_name.lower()[:35]} pria",
                "imageUrl": get_secure_image_url(top.get('link'))
            },
            {
                "category": "bawahan",
                "name": bottom_name,
                "material": FABRIC_MAP.get(bottom_art, "Katun Twill Stretch 100% Breathable"),
                "color": bottom_color,
                "colorHex": get_color_hex(bottom_color),
                "estimatedPrice": f"Rp {bottom_price:,}".replace(",", "."),
                "shopeeQuery": f"{bottom_name.lower()[:35]} pria",
                "tokopediaQuery": f"{bottom_name.lower()[:35]}",
                "imageUrl": get_secure_image_url(bottom.get('link'))
            },
            {
                "category": "sepatu",
                "name": shoe_name,
                "material": FABRIC_MAP.get(shoe_art, "Microfiber Leather Cushioned Insole"),
                "color": shoe_color,
                "colorHex": get_color_hex(shoe_color),
                "estimatedPrice": f"Rp {shoe_price:,}".replace(",", "."),
                "shopeeQuery": f"{shoe_name.lower()[:35]}",
                "tokopediaQuery": f"{shoe_name.lower()[:35]}",
                "imageUrl": get_secure_image_url(shoe.get('link'))
            }
        ]
        
        preset = {
            "id": preset_id,
            "title": title,
            "tagline": f"Kombinasi maskulin rapi dan mobilitas tinggi untuk {occ[2]}.",
            "overallVibe": f"{occ[0]} · {top_color} & {bottom_color}",
            "comfortRating": round(random.uniform(4.8, 5.0), 1),
            "affordabilityRating": round(random.uniform(4.6, 4.9), 1),
            "modestFriendly": True,
            "skinToneMatch": f"Sangat kontras dan tegas untuk kulit Sawo Matang & Eksotis Tropis.",
            "whyItWorks": f"Kemeja {items[0]['material']} berpadu celana stretch nyaman di mobilitas cuaca lembap.",
            "stylingTip": "Gulung lengan kemeja 2 lipatan di bawah siku untuk aksen santai tapi profesional.",
            "colorPalette": swatches,
            "items": items,
            "createdAt": "2026-10-15T00:00:00.000Z"
        }
        
        synthesized_presets[preset_id] = preset
        synthesized_trending.append({
            "id": look_id,
            "title": title,
            "vibe": occ[1],
            "tag": "MENSWEAR",
            "category": occ[0],
            "skinToneRecommendation": "Sawo Matang & Eksotis Tropis",
            "priceRange": f"{price_range} / Set",
            "image": get_secure_image_url(top.get('link')),
            "likes": random.randint(390, 1420),
            "outfit": preset
        })
        count_male += 1
        
    print(f"Synthesis finished! Generated: Hijab={count_hijab}, Female={count_female}, Male={count_male}")
    print(f"Total newly synthesized: {count_hijab + count_female + count_male}")
    
    # Export to src/lib/synthesized-catalog.ts
    output_path = "src/lib/synthesized-catalog.ts"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write('import { OOTDRecommendation, TrendingLook } from "./types";\n\n')
        f.write('/**\n * EXTENDED_OOTD_CATALOG\n * 478 Synthesized Real-Product Formulas from Dataset #3 (Param Aggarwal) & #5.\n')
        f.write(' * Combined with 22 Signature Sets = Exactly 500 Formula Catalogs.\n */\n')
        f.write('export const EXTENDED_OOTD_CATALOG: Record<string, OOTDRecommendation> = ')
        f.write(json.dumps(synthesized_presets, indent=2, ensure_ascii=False))
        f.write(';\n\n')
        
        f.write('export const EXTENDED_TRENDING_LOOKS: TrendingLook[] = ')
        f.write(json.dumps(synthesized_trending, indent=2, ensure_ascii=False))
        f.write(';\n\n')
        
        f.write('export const CATALOG_METRICS = {\n')
        f.write('  totalSignature: 22,\n')
        f.write(f'  totalExtended: {count_hijab + count_female + count_male},\n')
        f.write(f'  totalCatalog: {22 + count_hijab + count_female + count_male},\n')
        f.write(f'  rawCorpusCount: {len(df_styles)},\n')
        f.write(f'  cleanItemCount: {len(df)},\n')
        f.write('  breakdown: {\n')
        f.write(f'    wanita: 10 + {count_female},\n')
        f.write(f'    hijab: 6 + {count_hijab},\n')
        f.write(f'    pria: 6 + {count_male}\n')
        f.write('  }\n')
        f.write('};\n')
        
    print(f"Successfully exported 500 catalog dataset to {output_path}!")

if __name__ == "__main__":
    synthesize_500()
