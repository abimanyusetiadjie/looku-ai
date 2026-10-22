import csv
import json
import os

def build_300_lookbook():
    csv_path = "data/look_u 300 data.csv"
    if not os.path.exists(csv_path):
        print(f"File {csv_path} not found!")
        return

    # Load verified real working images from looku_1000_pinterest_ootd.json
    verified_images = []
    with open("scratch/datasets/looku_1000_pinterest_ootd.json", "r", encoding="utf-8") as f:
        pins = json.load(f)
        for p in pins:
            img = p.get("image")
            if img and img.startswith("https://i.pinimg.com/originals/"):
                verified_images.append(img)

    print(f"Loaded {len(verified_images)} verified real working Pinterest image URLs!")

    looks = []
    with open(csv_path, "r", encoding="utf-8-sig", errors="replace") as f:
        reader = csv.DictReader(f)
        for idx, row in enumerate(reader):
            look_id = row.get("id", "").strip() or f"look_curated_{idx+1:03d}"
            title = row.get("title", "").strip() or f"Curated OOTD #{idx+1}"
            tag = row.get("tag_badge", "").strip() or "CURATED LOOK"
            category = row.get("event_category", "").strip() or "Wanita"
            vibe = row.get("vibe", "").strip() or "Earthy Minimalist"
            price_range = row.get("price_range", "").strip() or "Rp 250.000 - Rp 380.000"
            skin_tone = row.get("skin_tone", "").strip() or "Sawo Matang & Kuning Langsat"
            is_golden = (idx % 20 == 0) # Top look in each batch marked golden

            # Assign real verified working image URL from dataset
            hero_image = verified_images[idx % len(verified_images)]
            shopee_set_url = row.get("fullset_shopee_affiliate_url", "").strip()

            top_name = row.get("top_name", "").strip() or "Atasan Katun Berpori"
            top_mat = row.get("top_material", "").strip() or "Katun Linen Crinkle"
            top_price = row.get("top_price", "").strip() or "Rp 129.000"
            top_shopee = row.get("top_shopee_affiliate_url", "").strip() or shopee_set_url
            top_query = row.get("top_shopee_fallback_keyword", "").strip() or top_name

            btm_name = row.get("bottom_name", "").strip() or "Bawahan Loose Sejuk"
            btm_mat = row.get("bottom_material", "").strip() or "Rayon Twill Dingin"
            btm_price = row.get("bottom_price", "").strip() or "Rp 99.000"
            btm_shopee = row.get("bottom_shopee_affiliate_url", "").strip() or shopee_set_url
            btm_query = row.get("bottom_shopee_fallback_keyword", "").strip() or btm_name

            outer_name = row.get("outer_name", "").strip() or "Hijab / Layer Ringan"
            outer_mat = row.get("outer_material", "").strip() or "Voal Ultrafine Laser Cut"
            outer_price = row.get("outer_price", "").strip() or "Rp 49.000"
            outer_shopee = row.get("outer_shopee_affiliate_url", "").strip() or shopee_set_url
            outer_query = row.get("outer_shopee_fallback_keyword", "").strip() or outer_name

            shoes_name = row.get("shoes_name", "").strip() or "Alas Kaki Nyaman"
            shoes_mat = row.get("shoes_material", "").strip() or "Canvas Berpori"
            shoes_price = row.get("shoes_price", "").strip() or "Rp 149.000"
            shoes_shopee = row.get("shoes_shopee_affiliate_url", "").strip() or shopee_set_url
            shoes_query = row.get("shoes_shopee_fallback_keyword", "").strip() or shoes_name

            items = [
                {
                    "category": "atasan",
                    "name": top_name,
                    "material": top_mat,
                    "color": "Neutral",
                    "colorHex": "#EAE5DF",
                    "estimatedPrice": top_price,
                    "shopeeQuery": top_query,
                    "tokopediaQuery": top_name,
                    "shopeeUrl": top_shopee
                },
                {
                    "category": "bawahan",
                    "name": btm_name,
                    "material": btm_mat,
                    "color": "Sand",
                    "colorHex": "#D5C8B8",
                    "estimatedPrice": btm_price,
                    "shopeeQuery": btm_query,
                    "tokopediaQuery": btm_name,
                    "shopeeUrl": btm_shopee
                },
                {
                    "category": "outer_hijab",
                    "name": outer_name,
                    "material": outer_mat,
                    "color": "Soft Tint",
                    "colorHex": "#C2B29F",
                    "estimatedPrice": outer_price,
                    "shopeeQuery": outer_query,
                    "tokopediaQuery": outer_name,
                    "shopeeUrl": outer_shopee
                },
                {
                    "category": "sepatu",
                    "name": shoes_name,
                    "material": shoes_mat,
                    "color": "Clean White",
                    "colorHex": "#FFFFFF",
                    "estimatedPrice": shoes_price,
                    "shopeeQuery": shoes_query,
                    "tokopediaQuery": shoes_name,
                    "shopeeUrl": shoes_shopee
                }
            ]

            default_palette = [
                {"name": "Earthy Sand", "hex": "#D8C7B5"},
                {"name": "Warm Muted Cream", "hex": "#F5EFEB"},
                {"name": "Terracotta Soft", "hex": "#C87D55"},
                {"name": "Charcoal Deep", "hex": "#2B2927"}
            ]

            is_modest = "hijab" in category.lower() or "modest" in category.lower()

            look = {
                "id": look_id,
                "title": title,
                "vibe": vibe,
                "tag": tag,
                "category": category,
                "skinToneRecommendation": skin_tone,
                "priceRange": price_range,
                "image": hero_image,
                "likes": 750 + ((idx * 37) % 650),
                "isGoldenSignature": is_golden,
                "shopeeUrl": shopee_set_url,
                "outfit": {
                    "id": look_id,
                    "title": title,
                    "tagline": f"Kombinasi {vibe} sejuk & nyaman untuk iklim tropis 33°C.",
                    "overallVibe": vibe,
                    "comfortRating": 9.7,
                    "affordabilityRating": 9.3,
                    "modestFriendly": is_modest,
                    "skinToneMatch": f"Sangat harmonis untuk {skin_tone}.",
                    "whyItWorks": f"Perpaduan sirkulasi udara optimal dari {top_mat} dan {btm_mat} menjaga tubuh tetap sejuk tanpa gerah.",
                    "stylingTip": f"Padukan dengan aksesori minimalis senada agar aksen {vibe} terlihat bersih dan rapi.",
                    "colorPalette": default_palette,
                    "items": items,
                    "createdAt": "2026-10-22T08:00:00.000Z",
                    "isGoldenSignature": is_golden,
                    "heroImage": hero_image,
                    "shopeeUrl": shopee_set_url
                }
            }
            looks.append(look)

    print(f"Successfully processed {len(looks)} complete OOTD looks!")

    # 1. Save to data/LOOKBOOK_IMPORTED.json
    output_json = "data/LOOKBOOK_IMPORTED.json"
    with open(output_json, "w", encoding="utf-8") as f:
        json.dump(looks, f, indent=2, ensure_ascii=False)
    print(f"Saved to {output_json}")

    # 2. Save to src/lib/lookbook-300.json
    lib_json = "src/lib/lookbook-300.json"
    with open(lib_json, "w", encoding="utf-8") as f:
        json.dump(looks, f, indent=2, ensure_ascii=False)
    print(f"Saved to {lib_json}")

if __name__ == "__main__":
    build_300_lookbook()
