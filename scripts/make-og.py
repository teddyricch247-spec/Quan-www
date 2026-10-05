#!/usr/bin/env python3
"""
Generates the 1200x630 share images (Open Graph / Twitter cards) and the
512x512 logo used in structured data.

    pip install pillow
    python3 scripts/make-og.py

Run it from the repository root. It writes:
  - src/app/<route>/opengraph-image.png (+ .alt.txt)  one per route
  - public/og/<slug>.png                               one per blog post
  - public/og/demo-<slug>.png                          one per demo (DEMOS below)
  - public/logo.png                                    Organization logo

When you add a blog post, add a line to POSTS below (same slug and title as
the post, plus the label shown above the title) and run the script again.
Every card is drawn from this file, so a title change here is the only edit
needed to refresh its image.

Fonts: it looks for a clean sans-serif on your machine. Pass --font and
--font-bold to use a specific .ttf/.otf (for example Inter).
"""
import argparse
import os
import sys

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG = (250, 251, 252)
INK = (22, 24, 26)
INK_2 = (92, 97, 103)
INK_3 = (148, 154, 161)
RED = (228, 0, 43)

SITE = "www.quancis.space"

# (route folder under src/app, eyebrow, title, subtitle, alt text)
ROUTES = [
    ("", "Quancis", "One Model. Three Ways In.",
     "Kael, Quan Harness and Quan Chat, built on a composite intelligence.",
     "Quancis: one model, three ways in. Kael, Quan Harness and Quan Chat."),
    ("kael", "Kael  /  API", "A Composite Intelligence, Built For Accuracy.",
     "Draft, check, refine. Works with the SDKs you already use.",
     "Kael: a composite intelligence built for accuracy."),
    ("kael/demo", "Kael  /  Demos", "Built In Chat.",
     "Playable 3D games Kael wrote in a chat window, as single HTML files.",
     "Kael demos: playable 3D games written in a chat window."),
    ("harness", "Quan Harness  /  Coding agent", "An Agent That Ships.",
     "Plans, writes and finishes the work. Built on Kael.",
     "Quan Harness: a coding agent that ships."),
    ("chat", "Quan Chat  /  Assistant", "Kael, In A Conversation.",
     "Deep reasoning when you need it. A web toggle for lookups.",
     "Quan Chat: Kael in a conversation."),
    ("blog", "Blog", "Notes From Quancis.",
     "Research, engineering and product updates from the team building Kael.",
     "The Quancis blog."),
    ("legal", "Legal", "Terms And Privacy, Product By Product.",
     "Kael, Harness and Chat are separate products with their own terms.",
     "Quancis legal information."),
    ("pricing", "Pricing", "Pricing.",
     "Pay per token through the API, or one subscription for the apps.",
     "Quancis pricing."),
    ("about", "Company", "About Quancis.",
     "Many parts, one answer.",
     "About Quancis."),
    ("contact", "Company", "Contact Us.",
     "support@quancis.space  /  response@quancis.space",
     "Contact Quancis."),
    ("examples", "Kael  /  Examples", "What Kael Produces.",
     "Prompts, settings and outputs.",
     "Examples of Kael outputs."),
]

# (slug, label above the title, title). Keep in step with src/data/posts.
POSTS = [
    ("the-thinking-behind-kael", "Blog  /  Research",
     "Scratch Paper, Second Drafts and Many Students: The Thinking Behind Kael"),
    ("best-of-n-to-mind-evolution", "Blog  /  Research",
     "From Best-of-N to Mind Evolution: How AI Systems Spend Extra Compute"),
    ("ai-generated-code-security-review", "Blog  /  Engineering",
     "AI-Written Code Has a Security Problem. Here\u2019s How to Review It."),
    ("introducing-kael", "Blog  /  Product", "Introducing Kael"),
    ("why-kael-is-slower-on-purpose", "Blog  /  Engineering", "Why Kael Is Slower, On Purpose"),
]

# (slug, label above the title, title, subtitle). One card per demo, written to
# public/og/demo-<slug>.png. Keep in step with src/data/demos.ts (`ogImage`).
DEMOS = [
    ("blockscape", "Kael  /  Demo", "Blockscape.",
     "A voxel sandbox with a day and night cycle, written in chat as one HTML file."),
    ("ouroboros", "Kael  /  Demo", "Ouroboros.",
     "A 3D survival snake game Kael wrote in chat, as one HTML file."),
    ("chess", "Kael  /  Demo", "3D Chess.",
     "A full chess game against an AI, written in chat as one HTML file."),
]

FONT_REGULAR = [
    "/usr/share/texmf/fonts/opentype/public/tex-gyre/texgyreheros-regular.otf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    "/Library/Fonts/Arial.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "C:\\Windows\\Fonts\\arial.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
]
FONT_BOLD = [
    "/usr/share/texmf/fonts/opentype/public/tex-gyre/texgyreheros-bold.otf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "C:\\Windows\\Fonts\\arialbd.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]


def pick(paths, override):
    if override:
        return override
    for p in paths:
        if os.path.exists(p):
            return p
    sys.exit("No usable font found. Pass --font and --font-bold.")


def draw_mark(d, x, y, size, rgb=(0, 0, 0)):
    """The Quancis mark: a 4x4 grid of blocks, one of them red (see src/app/icon.svg)."""
    u = size / 4.0
    blocks = [(1, 0, 2, 1), (0, 1, 1, 2), (3, 1, 1, 1), (2, 2, 1, 1), (1, 3, 1, 1)]
    for bx, by, bw, bh in blocks:
        d.rectangle([x + bx * u, y + by * u, x + (bx + bw) * u - 1, y + (by + bh) * u - 1], fill=rgb)
    d.rectangle([x + 3 * u, y + 3 * u, x + 4 * u - 1, y + 4 * u - 1], fill=RED)


def wrap(d, text, font, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = f"{cur} {w}".strip()
        if d.textlength(trial, font=font) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def spaced(d, xy, text, font, fill, tracking):
    x, y = xy
    for ch in text:
        d.text((x, y), ch, font=font, fill=fill)
        x += d.textlength(ch, font=font) + tracking


def card(path, eyebrow, title, subtitle, fonts):
    reg, bold = fonts
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # top row: mark + wordmark
    draw_mark(d, 80, 64, 64)
    d.text((164, 70), "Quancis", font=ImageFont.truetype(bold, 40), fill=INK)

    # eyebrow
    spaced(d, (80, 188), eyebrow.upper(), ImageFont.truetype(bold, 22), RED, 3)

    # title: the largest size at which title + subtitle fit above the footer
    max_w = W - 160
    sf = ImageFont.truetype(reg, 30)
    sub_lines = wrap(d, subtitle, sf, max_w)[:2] if subtitle else []
    sub_h = (14 + 42 * len(sub_lines)) if sub_lines else 0
    size = 76
    while True:
        f = ImageFont.truetype(bold, size)
        lines = wrap(d, title, f, max_w)
        bottom = 236 + len(lines) * int(size * 1.14) + sub_h
        if (len(lines) <= 3 and bottom <= 522) or size <= 46:
            break
        size -= 2
    y = 236
    line_h = int(size * 1.14)
    for line in lines[:3]:
        d.text((80, y), line, font=f, fill=INK)
        y += line_h

    # subtitle (up to 2 lines)
    if sub_lines:
        y += 14
        for line in sub_lines:
            d.text((80, y), line, font=sf, fill=INK_2)
            y += 42

    # footer
    d.rectangle([80, 556, 80 + 96, 556 + 7], fill=RED)
    d.text((200, 546), SITE, font=ImageFont.truetype(reg, 26), fill=INK_3)

    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "PNG", optimize=True)
    print("wrote", path)


def logo(path):
    img = Image.new("RGB", (512, 512), (255, 255, 255))
    d = ImageDraw.Draw(img)
    draw_mark(d, 76, 76, 360)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, "PNG", optimize=True)
    print("wrote", path)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--font", help="regular .ttf/.otf")
    ap.add_argument("--font-bold", help="bold .ttf/.otf")
    args = ap.parse_args()
    fonts = (pick(FONT_REGULAR, args.font), pick(FONT_BOLD, args.font_bold))

    for folder, eyebrow, title, sub, alt in ROUTES:
        base = os.path.join("src", "app", folder)
        card(os.path.join(base, "opengraph-image.png"), eyebrow, title, sub, fonts)
        with open(os.path.join(base, "opengraph-image.alt.txt"), "w", encoding="utf-8") as fh:
            fh.write(alt)

    for slug, label, title in POSTS:
        card(os.path.join("public", "og", f"{slug}.png"), label, title, "By Response Mosese  /  Quancis", fonts)

    for slug, label, title, sub in DEMOS:
        card(os.path.join("public", "og", f"demo-{slug}.png"), label, title, sub, fonts)

    # Fallback for any page that has no image of its own.
    card(os.path.join("public", "og", "default.png"), ROUTES[0][1], ROUTES[0][2], ROUTES[0][3], fonts)
    logo(os.path.join("public", "logo.png"))


if __name__ == "__main__":
    main()
