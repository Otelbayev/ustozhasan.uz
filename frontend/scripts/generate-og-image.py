#!/usr/bin/env python3
"""
Ijtimoiy tarmoqlar uchun ulashish rasmini (og:image) yasaydi.

Telegram, WhatsApp, Facebook va Twitter havolani koʻrsatganda aynan shu rasmni
chiqaradi. Shuning uchun rasmning oʻzida "HASAN ABDULLAYEV" ismi yirik yozilgan —
odam havolani ochmasdan ham kimning sayti ekanini koʻradi.

Oʻlcham 1200x630 (1.91:1) — Telegram va Facebook aynan shu nisbatda katta
(kichik kvadrat emas) preview koʻrsatadi.

Ishga tushirish:
    python3 scripts/generate-og-image.py

Natija:
    public/images/hasan-abdullayev-ustoz-hasan-og.jpg   (1200x630, Telegram/Facebook)
    public/images/hasan-abdullayev-ustoz-hasan-kvadrat.jpg (1080x1080, Instagram/WhatsApp)
"""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "public" / "images"
PORTRAIT = IMAGES / "hasan-abdullayev-kompyuter-savodxonligi-oqituvchisi.jpg"

FONTS = Path("/System/Library/Fonts/Supplemental")
F_BLACK = FONTS / "Arial Black.ttf"
F_BOLD = FONTS / "Arial Bold.ttf"
F_REG = FONTS / "Arial.ttf"

# Saytning Hero bo‘limidagi gradient bilan bir xil ranglar
C_TOP_LEFT = (30, 58, 138)     # blue-900
C_MID = (49, 46, 129)          # indigo-900
C_BOTTOM_RIGHT = (88, 28, 135) # purple-900


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size)


class Layer:
    """
    Yarim shaffof shakl/matnni toʻgʻri chizish uchun yordamchi.

    ImageDraw RGBA rasmga chizganda ranglarni aralashtirmaydi — piksellarni
    almashtiradi. Natijada alfa qiymati JPEG ga oʻtkazishda yoʻqoladi va shakl
    toʻliq shaffofmas boʻlib qoladi. Shuning uchun har bir yarim shaffof element
    alohida qatlamga chizilib, keyin `alpha_composite` bilan qoʻshiladi.
    """

    def __init__(self, canvas: Image.Image):
        self.canvas = canvas

    def __enter__(self) -> ImageDraw.ImageDraw:
        self._layer = Image.new("RGBA", self.canvas.size, (0, 0, 0, 0))
        return ImageDraw.Draw(self._layer)

    def __exit__(self, *exc) -> None:
        self.canvas.alpha_composite(self._layer)


def gradient(size: tuple[int, int]) -> Image.Image:
    """Diagonal gradient. Kichik rasmda hisoblab, keyin kattalashtiramiz — tez va silliq."""
    w, h = 64, 64
    small = Image.new("RGB", (w, h))
    px = small.load()
    for y in range(h):
        for x in range(w):
            # 0..1 diagonal bo‘yicha
            t = (x / (w - 1) + y / (h - 1)) / 2
            if t < 0.5:
                a, b, k = C_TOP_LEFT, C_MID, t / 0.5
            else:
                a, b, k = C_MID, C_BOTTOM_RIGHT, (t - 0.5) / 0.5
            px[x, y] = tuple(round(a[i] + (b[i] - a[i]) * k) for i in range(3))
    return small.resize(size, Image.LANCZOS)


def add_glow(img: Image.Image, center: tuple[int, int], radius: int, color: tuple[int, int, int], alpha: int) -> None:
    """Hero bo‘limidagidek yumshoq rangli yorug‘lik dog‘i."""
    glow = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(glow)
    cx, cy = center
    d.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=(*color, alpha))
    glow = glow.filter(ImageFilter.GaussianBlur(radius // 2))
    img.alpha_composite(glow)


def add_dots(img: Image.Image, step: int = 40, alpha: int = 26) -> None:
    """Hero fonidagi nuqtali naqsh."""
    dots = Image.new("RGBA", img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(dots)
    for y in range(0, img.height, step):
        for x in range(0, img.width, step):
            d.ellipse((x, y, x + 3, y + 3), fill=(255, 255, 255, alpha))
    img.alpha_composite(dots)


def rounded_portrait(box: int, radius: int) -> Image.Image:
    """Portretning yuz qismini kvadrat qilib kesib, burchaklarini yumaloqlaydi."""
    src = Image.open(PORTRAIT).convert("RGB")
    side = min(src.width, src.height)
    left = (src.width - side) // 2
    # Yuz yuqorida — saytdagi `object-top` bilan bir xil kadr
    src = src.crop((left, 0, left + side, side)).resize((box, box), Image.LANCZOS)

    mask = Image.new("L", (box, box), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, box - 1, box - 1), radius=radius, fill=255)

    out = Image.new("RGBA", (box, box), (0, 0, 0, 0))
    out.paste(src, (0, 0), mask)
    return out


def paste_portrait(canvas: Image.Image, portrait: Image.Image, pos: tuple[int, int], radius: int) -> None:
    """Portretni oq halqa va rangli yorug‘lik bilan joylashtiradi."""
    x, y = pos
    box = portrait.width

    add_glow(canvas, (x + box // 2, y + box // 2), int(box * 0.62), (96, 165, 250), 90)

    ring = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ImageDraw.Draw(ring).rounded_rectangle(
        (x - 6, y - 6, x + box + 5, y + box + 5), radius=radius + 6, outline=(255, 255, 255, 64), width=6
    )
    canvas.alpha_composite(ring)
    canvas.alpha_composite(portrait, (x, y))


def text_size(f: ImageFont.FreeTypeFont, text: str) -> tuple[int, int, int, int]:
    """Matnning (chap, yuqori, kenglik, balandlik) oʻlchamlari."""
    l, t, r, b = ImageDraw.Draw(Image.new("RGB", (1, 1))).textbbox((0, 0), text, font=f)
    return l, t, r - l, b - t


def soft_text(canvas: Image.Image, xy: tuple[int, int], text: str, f: ImageFont.FreeTypeFont,
              fill: tuple[int, int, int, int]) -> None:
    """Yarim shaffof matn — fon rangi bilan aralashtirib chiziladi."""
    with Layer(canvas) as d:
        d.text(xy, text, font=f, fill=fill)


def pill(canvas: Image.Image, xy: tuple[int, int], text: str, f: ImageFont.FreeTypeFont,
         bg: tuple[int, int, int, int], fg: tuple[int, int, int, int],
         pad: tuple[int, int] = (22, 12)) -> tuple[int, int]:
    """Yumaloq fonli yorliq chizadi va uning (kenglik, balandlik) oʻlchamini qaytaradi."""
    x, y = xy
    px, py = pad
    l, t, w, h = text_size(f, text)
    box_w, box_h = w + px * 2, h + py * 2
    with Layer(canvas) as d:
        d.rounded_rectangle((x, y, x + box_w, y + box_h), radius=box_h // 2, fill=bg)
        d.text((x + px - l, y + py - t), text, font=f, fill=fg)
    return box_w, box_h


def build_landscape(out_path: Path) -> None:
    W, H = 1200, 630
    canvas = gradient((W, H)).convert("RGBA")
    add_dots(canvas)
    add_glow(canvas, (60, 90), 260, (59, 130, 246), 70)
    add_glow(canvas, (1150, 600), 300, (168, 85, 247), 70)

    portrait = rounded_portrait(box=430, radius=56)
    paste_portrait(canvas, portrait, pos=(716, 100), radius=56)

    d = ImageDraw.Draw(canvas)
    x = 72

    y = 74
    _, badge_h = pill(canvas, (x, y), "ustozhasan.uz", font(F_BOLD, 24), (255, 255, 255, 56), (255, 255, 255, 255))
    y += badge_h + 26

    # === Ism — rasmning eng yirik va eng koʻzga tashlanadigan qismi ===
    name_font = font(F_BLACK, 76)
    for line in ("HASAN", "ABDULLAYEV"):
        soft_text(canvas, (x + 3, y + 4), line, name_font, (10, 16, 50, 110))  # yumshoq soya
        d.text((x, y), line, font=name_font, fill=(255, 255, 255, 255))
        y += 88

    y += 12
    d.rounded_rectangle((x, y, x + 132, y + 7), radius=4, fill=(96, 165, 250, 255))
    y += 32

    d.text((x, y), "Kompyuter savodxonligi oʻqituvchisi", font=font(F_BOLD, 31), fill=(191, 219, 254, 255))
    y += 46
    soft_text(canvas, (x, y), "Onlayn kurs · Word · Excel · PowerPoint", font(F_REG, 26), (255, 255, 255, 215))
    y += 54

    free_font = font(F_BOLD, 25)
    pill_w, pill_h = pill(canvas, (x, y), "Birinchi dars BEPUL", free_font, (34, 197, 94, 255), (255, 255, 255, 255))

    # Statistika yorligʻi — "bepul" yorligʻining haqiqiy kengligidan keyin, ustma-ust tushmasin
    stats_font = font(F_REG, 22)
    _, t, _, stats_h = text_size(stats_font, "500+ bitiruvchi")
    soft_text(
        canvas,
        (x + pill_w + 26, y + (pill_h - stats_h) // 2 - t),
        "500+ bitiruvchi  ·  3+ yil tajriba",
        stats_font,
        (255, 255, 255, 200),
    )

    canvas.convert("RGB").save(out_path, "JPEG", quality=88, optimize=True, progressive=True)
    print(f"✓ {out_path.relative_to(ROOT)}  ({W}x{H})")


def build_square(out_path: Path) -> None:
    """Instagram/WhatsApp profil ulashuvlari uchun kvadrat variant."""
    S = 1080
    canvas = gradient((S, S)).convert("RGBA")
    add_dots(canvas, step=48)
    add_glow(canvas, (80, 120), 340, (59, 130, 246), 70)
    add_glow(canvas, (1030, 980), 380, (168, 85, 247), 70)

    portrait = rounded_portrait(box=520, radius=72)
    paste_portrait(canvas, portrait, pos=((S - 520) // 2, 92), radius=72)

    d = ImageDraw.Draw(canvas)
    y = 700

    name_font = font(F_BLACK, 84)
    for line in ("HASAN", "ABDULLAYEV"):
        l, _, w, _ = text_size(name_font, line)
        x = (S - w) // 2 - l
        soft_text(canvas, (x + 3, y + 4), line, name_font, (10, 16, 50, 110))
        d.text((x, y), line, font=name_font, fill=(255, 255, 255, 255))
        y += 96

    y += 40
    l, _, w, _ = text_size(font(F_BOLD, 34), "Kompyuter savodxonligi oʻqituvchisi")
    d.text(((S - w) // 2 - l, y), "Kompyuter savodxonligi oʻqituvchisi", font=font(F_BOLD, 34),
           fill=(191, 219, 254, 255))
    y += 54
    sub_font = font(F_REG, 30)
    l, _, w, _ = text_size(sub_font, "Onlayn kurs · ustozhasan.uz")
    soft_text(canvas, ((S - w) // 2 - l, y), "Onlayn kurs · ustozhasan.uz", sub_font, (255, 255, 255, 215))

    canvas.convert("RGB").save(out_path, "JPEG", quality=88, optimize=True, progressive=True)
    print(f"✓ {out_path.relative_to(ROOT)}  ({S}x{S})")


if __name__ == "__main__":
    build_landscape(IMAGES / "hasan-abdullayev-ustoz-hasan-og.jpg")
    build_square(IMAGES / "hasan-abdullayev-ustoz-hasan-kvadrat.jpg")
