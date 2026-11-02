"""Crop clean photo regions out of the IPMA KSA 2026 deck slides (1600x900 coordinate space)
and write optimised WebP files into public/images. Run once; outputs are committed."""
import sys, os
from PIL import Image

SRC = sys.argv[1]            # directory with p-000.jpg ... p-031.jpg
OUT = sys.argv[2]            # public/images
S = 1.2                      # 1600x900 -> 1920x1080

# name: (page, x1, y1, x2, y2, max_width)
CROPS = {
    "hero-village":   (1, 600, 80, 1600, 870, 1400),
    "diriyah-aerial": (2, 760, 80, 1600, 900, 1200),
    "expo-night":     (7, 400, 230, 1600, 840, 1400),
    "diriyah-dusk":   (20, 330, 290, 1600, 555, 1600),
    "red-sea":        (29, 760, 80, 1600, 900, 1100),
    "gpmf-lobby":     (10, 330, 80, 1600, 540, 1600),
    "gpmf-group":     (11, 0, 262, 1600, 850, 1600),
    "awards":         (16, 220, 335, 1520, 640, 1400),
    "ministers":      (18, 62, 358, 1045, 820, 1200),
    "pma-launch":     (22, 650, 215, 1340, 880, 1000),
    "milestones":     (21, 50, 300, 1535, 845, 1600),
    "pma-signing":    (25, 70, 215, 1010, 795, 1100),
    "professionals":  (9, 575, 255, 1015, 480, 800),
    # sector tiles from slide 3
    "sector-cities":        (3, 58, 255, 297, 640, 520),
    "sector-tourism":       (3, 306, 255, 543, 640, 520),
    "sector-entertainment": (3, 554, 255, 790, 640, 520),
    "sector-mobility":      (3, 802, 255, 1039, 640, 520),
    "sector-industry":      (3, 1298, 255, 1533, 640, 520),
}
TEAM = {
    "badr-burshaid":  (24, 75, 312, 355, 590),
    "badr-aldulami":  (24, 405, 315, 680, 590),
    "emine-bujupaj":  (24, 715, 408, 863, 668),
    "muhammad-mohsin":(24, 883, 395, 1033, 668),
    "asmaa-mabrouk":  (24, 1052, 395, 1202, 668),
    "jehad-alamri":   (24, 1221, 395, 1371, 668),
    "olubusola-awosanya": (24, 1390, 435, 1539, 668),
}

def page(n):
    return Image.open(os.path.join(SRC, f"p-{n-1:03d}.jpg")).convert("RGB")

def crop(n, x1, y1, x2, y2):
    return page(n).crop((int(x1*S), int(y1*S), int(x2*S), int(y2*S)))

for name, (n, x1, y1, x2, y2, mw) in CROPS.items():
    im = crop(n, x1, y1, x2, y2)
    if im.width > mw:
        im = im.resize((mw, round(im.height*mw/im.width)), Image.LANCZOS)
    im.save(os.path.join(OUT, f"{name}.webp"), "WEBP", quality=78, method=6)
    print(name, im.size)

for name, (n, x1, y1, x2, y2) in TEAM.items():
    im = crop(n, x1, y1, x2, y2)
    im.save(os.path.join(OUT, "team", f"{name}.webp"), "WEBP", quality=85, method=6)
    print("team", name, im.size)
