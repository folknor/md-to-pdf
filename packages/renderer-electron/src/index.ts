// Electron-based renderer for mdforge (no Puppeteer required)

// Re-export everything from @mdforge/core for convenience
export {
  type Config,
  defaultConfig,
  type Theme,
  themes,
} from "@mdforge/core";
export {
  type ConversionInfo,
  formatConversionInfo,
} from "@mdforge/core/conversion-info";
export {
  ConfigError,
  FileNotFoundError,
  GenerationError,
  IncludeError,
  MdforgeError,
} from "@mdforge/core/errors";
export {
  type FontConfig,
  type FontPairing,
  fontPairings,
} from "@mdforge/core/fonts";
export type { TemplatesConfig } from "@mdforge/core/includes";
export type { PdfMetadata } from "@mdforge/pdf";
export { resolveFileRefs } from "@mdforge/core/util";

// Export prepare types
export {
  type ConvertOptions,
  type PreparedConversion,
  type StylesheetEntry,
  prepareConversion,
} from "@mdforge/core/prepare";

// Export render function
export { render, type RenderResult } from "./render.js";

// Export backward-compatible convertMdToPdf
export { convertMdToPdf, type ConvertResult } from "./convert.js";
