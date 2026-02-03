/**
 * Browser-safe exports from @mdforge/renderer-electron
 * These can be imported in browser/renderer contexts without Node.js dependencies
 */

// biome-ignore lint/performance/noBarrelFile: Browser entry point
export {
  type FontPairingPreset,
  fontPairingPresets,
  type Theme,
  themes,
} from "@mdforge/core/browser";
