"""Create WebP derivatives; preserve original images. Requires Pillow."""
import argparse
from pathlib import Path
from PIL import Image, ImageOps

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("images", nargs="+", type=Path)
args = parser.parse_args()
for source in args.images:
    if source.suffix.lower() not in {".jpg", ".jpeg", ".png"}:
        parser.error("Supported sources: JPEG or PNG")
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        for width in sorted({min(480, image.width), min(800, image.width)}):
            height = round(image.height * width / image.width)
            target = source.with_name(source.stem + "-" + str(width) + ".webp")
            if target.exists():
                print("Already exists:", target)
                continue
            image.resize((width, height), Image.Resampling.LANCZOS).save(
                target, "WEBP", quality=88, method=6
            )
            print("Created", target, str(width) + "x" + str(height))
