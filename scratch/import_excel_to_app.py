import csv
import json
import os
import sys

def parse_csv_to_trending_looks(csv_path):
    if not os.path.exists(csv_path):
        print(f"Error: File '{csv_path}' tidak ditemukan.")
        return []

    looks = []
    with open(csv_path, mode="r", encoding="utf-8-sig") as f:
        content = f.read()
        first_line = content.splitlines()[0] if content.splitlines() else ""
        delimiter = "\t" if "\t" in first_line and first_line.count("\t") >= first_line.count(",") else ","

    with open(csv_path, mode="r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f, delimiter=delimiter)
        for idx, row in enumerate(reader):
            look_id = row.get("id", "").strip() or f"custom_look_{idx+1:02d}"
            title = row.get("title", "").strip() or "Untitled Look"
            tag = row.get("tag", "").strip() or "CURATED LOOK"
            category = row.get("category", "").strip() or "Wanita"
            vibe = row.get("vibe", "").strip() or "Earthy Minimalist"
            price_range = row.get("priceRange", "").strip() or "Rp 150.000 - Rp 300.000"
            skin_tone = row.get("skinTone", "").strip() or "Semua Warna Kulit"
            is_golden = row.get("isGolden", "").strip().upper() in ["TRUE", "1", "YES"]
            top_img = row.get("top_image_url", "").strip()
            btm_img = row.get("bottom_image_url", "").strip()
            hero_image = row.get("heroImage", "").strip() or top_img or btm_img or ""
            shopee_url = row.get("shopeeUrl", "").strip() or row.get("top_shopee_url", "").strip()

            # Helper for color fallback
            default_colors = [
                {"name": "Earthy Sand", "hex": "#D8C7B5"},
                {"name": "Warm Muted Cream", "hex": "#F5EFEB"},
                {"name": "Terracotta Soft", "hex": "#C87D55"},
                {"name": "Charcoal Deep", "hex": "#2B2927"}
            ]

            # 4 items definition
            items = [
                {
                    "category": "atasan",
                    "name": row.get("top_name", "").strip() or "Atasan Katun Berpori",
                    "material": row.get("top_material", "").strip() or "Katun Poplin Breathable",
                    "color": "Neutral",
                    "colorHex": "#EAE5DF",
                    "estimatedPrice": row.get("top_price", "").strip() or "Rp 99.000",
                    "shopeeQuery": row.get("top_name", "").strip(),
                    "tokopediaQuery": row.get("top_name", "").strip(),
                    "shopeeUrl": row.get("top_shopee_url", "").strip() or None,
                    "imageUrl": row.get("top_image_url", "").strip() or None,
                },
                {
                    "category": "bawahan",
                    "name": row.get("bottom_name", "").strip() or "Bawahan Loose Sejuk",
                    "material": row.get("bottom_material", "").strip() or "Rayon Twill / Katun",
                    "color": "Sand",
                    "colorHex": "#D5C8B8",
                    "estimatedPrice": row.get("bottom_price", "").strip() or "Rp 115.000",
                    "shopeeQuery": row.get("bottom_name", "").strip(),
                    "tokopediaQuery": row.get("bottom_name", "").strip(),
                    "shopeeUrl": row.get("bottom_shopee_url", "").strip() or None,
                    "imageUrl": row.get("bottom_image_url", "").strip() or None,
                },
                {
                    "category": "outer_hijab",
                    "name": row.get("outer_name", "").strip() or "Hijab / Layer Ringan",
                    "material": row.get("outer_material", "").strip() or "Voal / Katun Lembut",
                    "color": "Soft Tint",
                    "colorHex": "#C2B29F",
                    "estimatedPrice": row.get("outer_price", "").strip() or "Rp 45.000",
                    "shopeeQuery": row.get("outer_name", "").strip(),
                    "tokopediaQuery": row.get("outer_name", "").strip(),
                    "shopeeUrl": row.get("outer_shopee_url", "").strip() or None,
                    "imageUrl": row.get("outer_image_url", "").strip() or None,
                },
                {
                    "category": "sepatu",
                    "name": row.get("shoes_name", "").strip() or "Alas Kaki Nyaman",
                    "material": row.get("shoes_material", "").strip() or "Canvas / Breathable Insole",
                    "color": "White / Earthy",
                    "colorHex": "#FFFFFF",
                    "estimatedPrice": row.get("shoes_price", "").strip() or "Rp 95.000",
                    "shopeeQuery": row.get("shoes_name", "").strip(),
                    "tokopediaQuery": row.get("shoes_name", "").strip(),
                    "shopeeUrl": row.get("shoes_shopee_url", "").strip() or None,
                    "imageUrl": row.get("shoes_image_url", "").strip() or None,
                }
            ]

            # Construct TrendingLook object
            look = {
                "id": look_id,
                "title": title,
                "vibe": vibe,
                "tag": tag,
                "category": category,
                "skinToneRecommendation": skin_tone,
                "priceRange": price_range,
                "image": hero_image,
                "likes": 500 + (idx * 37) % 700,
                "isGoldenSignature": is_golden,
                "shopeeUrl": shopee_url or None,
                "outfit": {
                    "id": look_id,
                    "title": title,
                    "tagline": f"Kombinasi {vibe} sejuk & nyaman untuk iklim tropis.",
                    "overallVibe": vibe,
                    "comfortRating": 9.6,
                    "affordabilityRating": 9.2,
                    "modestFriendly": "hijab" in category.lower() or "modest" in category.lower(),
                    "skinToneMatch": f"Sangat harmonis untuk {skin_tone}.",
                    "whyItWorks": f"Perpaduan sirkulasi udara optimal dari {items[0]['material']} dan {items[1]['material']} menjaga tubuh tetap sejuk di suhu 33°C.",
                    "stylingTip": f"Padukan dengan aksesori minimalis senada agar aksen {vibe} terlihat bersih dan rapi.",
                    "colorPalette": default_colors,
                    "items": items,
                    "createdAt": "2026-10-22T00:00:00.000Z",
                    "isGoldenSignature": is_golden,
                    "heroImage": hero_image,
                    "shopeeUrl": shopee_url or None
                }
            }
            looks.append(look)

    return looks

if __name__ == "__main__":
    csv_file = sys.argv[1] if len(sys.argv) > 1 else "data/TEMPLATE_LOOKBOOK_LOOKU.csv"
    output_json = "data/LOOKBOOK_IMPORTED.json"

    print(f"Membaca dataset dari: {csv_file}...")
    looks = parse_csv_to_trending_looks(csv_file)
    print(f"Berhasil mengonversi {len(looks)} looks!")

    os.makedirs("data", exist_ok=True)
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(looks, f, indent=2, ensure_ascii=False)

    print(f"File JSON siap pakai disimpan di: {output_json}")
    print("Petunjuk:")
    print("1. Anda bisa menempelkan isi data/LOOKBOOK_IMPORTED.json langsung ke CMS Admin (menu Database & Sync).")
    print("2. Atau script ini juga dapat menyuntikkan data langsung ke src/lib/presets.ts.")
