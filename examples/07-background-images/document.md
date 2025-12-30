---
theme: beryl
header:
  background: header-bg.svg
  right: Page {page}/{pages}
footer:
  background: header-bg.svg
pdf_options:
  margin:
    top: 45mm
    bottom: 35mm
---

# Background Images

This example demonstrates full-width background images in headers and footers.

## Configuration

```yaml
header:
  background: header-bg.svg
  right: Page {page}/{pages}
footer:
  background: footer-bg.svg
```

## How It Works

Background images are embedded as base64 data URIs and rendered using CSS `background-size: cover`. The header anchors to the bottom edge, the footer to the top edge.

## Supported Formats

Any image format works:

- **SVG** - recommended, scales perfectly at any size
- **PNG** - good for complex graphics with transparency
- **JPG** - good for photographic backgrounds
- **WebP** - modern format with good compression

## Tips

- Use larger margins to make room for the background graphics
- SVG files scale perfectly at any size
- Text overlays appear on top of the background
