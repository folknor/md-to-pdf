# TODO

## Fillable PDF Form Field Fonts

Dropdown (and likely other form field) text is too large and uses Helvetica instead of the document's fonts.

### Why this happens

AcroForm fields are independent overlay objects with their own appearance settings. They don't inherit styling from the HTML/CSS content rendered underneath. pdf-lib uses Helvetica by default, and without explicit font size configuration, the text is often too large.

### Options

1. **Set explicit font size** - Call `dropdown.setFontSize(n)` to control size. Still uses Helvetica, but properly sized.

2. **Use a standard PDF font with size** - PDF has 14 built-in fonts (Helvetica, Times, Courier, Symbol, ZapfDingbats in various weights). No embedding needed.

3. **Embed the document's font for form fields** - pdf-lib supports embedding fonts (TTF/OTF) and using them in form fields via `form.updateFieldAppearances(font)`. More complex but gives visual consistency.

4. **Calculate size from field height** - Derive font size from field dimensions (e.g., `height * 0.6`).

### Option 5: Modify pdf-lib fork

We control the pdf-lib fork at `github:folknor/pdf-lib`. We could:

- Add auto-sizing logic that calculates appropriate font size from field dimensions
- Change default font behavior for form fields
- Add a way to easily share/inherit fonts already embedded in the document
- Make form fields automatically use a sensible font size based on field height

This is the most flexible option since we can tailor pdf-lib's behavior to our needs.

### Decision

TBD - likely option 5 (modify pdf-lib) for the best long-term solution
