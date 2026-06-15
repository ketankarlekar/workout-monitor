"""
Splits the muscle group grid image into individual 128x128 transparent-background PNGs.
"""
import os, zipfile, numpy as np
from PIL import Image

SRC = r'c:\Users\Ketan\Downloads\ChatGPT Image Jun 9, 2026, 01_25_20 PM.png'
OUT = os.path.join(os.path.dirname(SRC), 'exercise_icons')
ZIP = os.path.join(os.path.dirname(SRC), 'exercise_icons.zip')
os.makedirs(OUT, exist_ok=True)

# ── Grid coordinates detected from pixel analysis ───────────────────────────
# Row y-ranges (content only, excluding black separator bars)
ROWS = [
    (9,   304),   # row 1
    (353, 643),   # row 2
    (687, 964),   # row 3
    (988, 1254),  # row 4 — CORE only
]
# Column x-ranges for rows 1-3 (4 equal columns)
COLS = [0, 315, 622, 935, 1254]

# Labels in grid order; row 4 has one centred cell
GRID = [
    ['chest', 'shoulders', 'triceps', 'back'],
    ['rear_delts', 'biceps', 'forearms', 'quads'],
    ['hamstrings', 'glutes', 'calves', 'adductors'],
    ['core'],  # special: centred cell x=440..813
]
CORE_X = (440, 813)

ICON_SIZE = 128
# Black bg threshold: pixels with all channels < this become transparent
BG_THRESH = 18


def make_transparent(img_rgb: Image.Image) -> Image.Image:
    """Remove near-black background → alpha channel."""
    rgba = img_rgb.convert('RGBA')
    data = np.array(rgba, dtype=np.uint8)
    r, g, b = data[:,:,0], data[:,:,1], data[:,:,2]
    mask = (r < BG_THRESH) & (g < BG_THRESH) & (b < BG_THRESH)
    data[:,:,3] = np.where(mask, 0, 255)
    return Image.fromarray(data, 'RGBA')


def fit_to_square(img: Image.Image, size: int) -> Image.Image:
    """Resize keeping aspect ratio, centre on transparent square canvas."""
    img.thumbnail((size, size), Image.LANCZOS)
    canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    offset = ((size - img.width) // 2, (size - img.height) // 2)
    canvas.paste(img, offset, mask=img if img.mode == 'RGBA' else None)
    return canvas


src = Image.open(SRC).convert('RGB')
generated = []

for row_idx, (y0, y1) in enumerate(ROWS):
    names = GRID[row_idx]
    if row_idx < 3:
        col_bounds = [(COLS[c], COLS[c+1]) for c in range(4)]
    else:
        col_bounds = [CORE_X]

    for col_idx, name in enumerate(names):
        x0, x1 = col_bounds[col_idx]
        margin = 6
        cell = src.crop((
            max(0, x0 + margin),
            max(0, y0 + margin),
            min(src.width,  x1 - margin),
            min(src.height, y1 - margin),
        ))
        cell_rgba = make_transparent(cell)
        icon = fit_to_square(cell_rgba, ICON_SIZE)

        fname = f'{name}_icon.png'
        fpath = os.path.join(OUT, fname)
        icon.save(fpath, 'PNG')
        generated.append(fname)
        print(f'  OK  {fname}')

# ── ZIP ──────────────────────────────────────────────────────────────────────
with zipfile.ZipFile(ZIP, 'w', zipfile.ZIP_DEFLATED) as zf:
    for fname in generated:
        zf.write(os.path.join(OUT, fname), fname)

print(f'\nAll {len(generated)} icons saved to: {OUT}')
print(f'ZIP:  {ZIP}')
