# Header/Footer Modes - Technical Breakdown

## The 3 Modes

### Mode 1: Raw Puppeteer (`pdf_options.headerTemplate`)
- User writes raw HTML
- We do nothing, just pass through
- **Keep**: Yes, it's the escape hatch for power users

### Mode 2: Simplified Puppeteer (`header`/`footer` → `header-footer.ts`)
- Converts simple YAML to HTML templates
- Uses Puppeteer's `displayHeaderFooter` mechanism
- **File**: `src/lib/header-footer.ts` (174 lines)

### Mode 3: Paged.js (`paged_js: true` → `paged-css.ts`)
- Converts simple YAML to CSS @page rules
- Uses paged.js polyfill for rendering
- **File**: `src/lib/paged-css.ts` (257 lines)

---

## What's Duplicated

Both Mode 2 and Mode 3 have:
- `formatDate()` function (identical)
- Image → base64 embedding logic (similar)
- MIME type maps (identical)
- Variable parsing (`{page}`, `{date}`, etc.)
- Three-column normalization

Total overlap: ~80 lines of near-identical code

---

## What's Different

| Aspect | Mode 2 (Puppeteer) | Mode 3 (Paged.js) |
|--------|-------------------|-------------------|
| Output | HTML template | CSS @page rules |
| Markdown | Parsed to HTML | Stripped to plain text |
| `{title}` | Puppeteer's `<span class="title">` | CSS `string(doctitle)` from h1 |
| `{chapter}` | **Broken** (no Puppeteer class) | Works via `string(chaptertitle)` |
| First page exceptions | Not possible | `firstPageHeader: false` works |
| Images | `<img src="data:...">` | `url("data:...")` in CSS |
| Speed | Fast | ~1s slower (paged.js reflow) |
| Rendering | Puppeteer margin boxes | In-page content |

---

## The Core Problem

Mode 2 and Mode 3 solve the same user need (simple YAML config) but:
1. Use completely different rendering approaches
2. Have different feature sets
3. Have duplicated utility code
4. Require user to understand when to use which

---

## Options

### Option A: Keep Both
- Pros: Feature parity not required, users can choose
- Cons: Maintenance burden, confusing docs, duplicated code
- Work: Extract shared utilities, document differences

### Option B: Drop Mode 2, Keep Mode 3 (Paged.js only)
- Pros: Running headers, first-page exceptions, cleaner architecture
- Cons: Slower, markdown in h/f becomes plain text, paged.js dependency
- Work: Delete `header-footer.ts`, update docs

### Option C: Drop Mode 3, Keep Mode 2 (Puppeteer only)
- Pros: Faster, markdown works, simpler
- Cons: No running headers, no first-page exceptions, `{chapter}` broken
- Work: Delete `paged-css.ts`, remove paged.js integration, remove `paged_js`/`firstPage*` config

### Option D: Merge into Mode 3 with fallback
- When `paged_js: true` OR advanced features used → paged.js
- Otherwise → Puppeteer (faster, markdown works)
- Pros: Best of both, auto-selection
- Cons: Complex logic, still maintaining both

---

## My Take

**Mode 2 feels half-baked.** The `{chapter}` variable is broken (Puppeteer has no class for it), and no first-page exceptions. It's a dead end feature-wise.

**Mode 3 is more capable** but slower and strips markdown.

If you want one system: **Keep Mode 3, drop Mode 2.** Accept the tradeoffs (no markdown styling in h/f, slight speed hit).

If you want both: Extract the shared code into a common utility module, clearly document when to use which.

---

## The Intermingling

Currently in `md-to-pdf.ts` lines 91-174:

```
if (header || footer) {
    collect CSS from all stylesheets

    if (paged_js) {
        → Mode 3: generatePagedCss()
        → add to stylesheets
        → inject paged.js script
        → margins = 0
        → displayHeaderFooter = false
    } else {
        → Mode 2: buildHeaderFooterTemplate()
        → set pdf_options.headerTemplate/footerTemplate
    }
}

if (!paged_js && templates exist) {
    → displayHeaderFooter = true
}
```

Mode 1 (raw) just passes through `pdf_options.headerTemplate` unchanged and hits the auto-enable at the end.

---

## Variable Support by Mode

| Variable | Mode 1 (Raw) | Mode 2 (Puppeteer) | Mode 3 (Paged.js) |
|----------|--------------|-------------------|-------------------|
| `{page}` | Manual | ✅ | ✅ |
| `{pages}` | Manual | ✅ | ✅ |
| `{date}` | Manual | ✅ | ✅ |
| `{date:locale}` | ❌ | ✅ | ✅ |
| `{title}` | Manual | ✅ (doc title) | ✅ (h1 text) |
| `{chapter}` | ❌ | ❌ (broken) | ✅ (h2 text) |
| `{url}` | Manual | ✅ | ✅ |

---

## Config Options by Mode

| Option | Mode 1 | Mode 2 | Mode 3 |
|--------|--------|--------|--------|
| `pdf_options.headerTemplate` | ✅ | Overrides | Ignored |
| `pdf_options.footerTemplate` | ✅ | Overrides | Ignored |
| `header` | ❌ | ✅ | ✅ |
| `footer` | ❌ | ✅ | ✅ |
| `paged_js` | ❌ | ❌ | Required |
| `firstPageHeader` | ❌ | ❌ | ✅ |
| `firstPageFooter` | ❌ | ❌ | ✅ |

---

## Current Issues/Quirks

1. **Mode 3 hardcodes A4**: `paged-css.ts` line 223 always outputs `size: A4`
2. **Mode 3 hardcodes margins**: `margin: 25mm 20mm` - not configurable
3. **Mode 3 strips markdown**: CSS `content` property can't have HTML
4. **No {chapter} in Mode 2**: Variable exists but maps to nothing - Puppeteer has no such class
5. **Date locale quirk**: `{date}` in Mode 2 uses browser's date span, but `{date:nb-NO}` pre-formats at build time (both modes)
