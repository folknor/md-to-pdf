import type { Theme } from "@mdforge/core";

export interface ConversionConfig {
  theme?: Theme;
  fontPairing?: string;
  author?: string;
  outputDir: string;
  outputPath?: string;
}

export interface ConversionResult {
  success: boolean;
  inputPath: string;
  outputPath: string;
  error?: string;
}

export interface ConversionProgress {
  file: string;
  progress: number;
}

export interface ElectronAPI {
  // Conversion
  convertFiles: (
    files: string[],
    config: ConversionConfig,
  ) => Promise<ConversionResult[]>;

  // File dialogs
  selectFiles: () => Promise<string[]>;
  selectOutputDir: () => Promise<string | null>;

  // Events
  onConversionProgress: (
    callback: (progress: ConversionProgress) => void,
  ) => () => void;
}
