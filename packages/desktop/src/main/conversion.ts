import {
  type Config,
  convertMdToPdf,
  defaultConfig,
} from "@mdforge/renderer-electron";
import type { ConversionConfig, ConversionResult } from "../types";

export async function convertFile(
  filePath: string,
  config: ConversionConfig,
  onProgress?: (progress: number) => void,
): Promise<ConversionResult> {
  const outputPath = config.outputPath ?? "";
  try {
    const mergedConfig: Partial<Config> = {
      ...defaultConfig,
      dest: outputPath,
    };

    if (config.theme) {
      mergedConfig.theme = config.theme;
    }

    if (config.fontPairing) {
      mergedConfig.fonts = config.fontPairing;
    }

    if (config.author) {
      mergedConfig.metadata = { author: config.author };
    }

    onProgress?.(50);

    const result = await convertMdToPdf(
      { path: filePath },
      mergedConfig as Config,
    );

    onProgress?.(100);

    return {
      success: true,
      inputPath: filePath,
      outputPath: result.filename ?? outputPath,
    };
  } catch (error) {
    const err = error as Error;
    return {
      success: false,
      inputPath: filePath,
      outputPath,
      error: err.message,
    };
  }
}

export async function convertFiles(
  files: string[],
  config: ConversionConfig,
  onProgress?: (file: string, progress: number) => void,
): Promise<ConversionResult[]> {
  const results: ConversionResult[] = [];

  for (const file of files) {
    const result = await convertFile(
      file,
      {
        ...config,
        outputPath: getOutputPath(file, config.outputDir),
      },
      (progress) => onProgress?.(file, progress),
    );
    results.push(result);
  }

  return results;
}

function getOutputPath(inputPath: string, outputDir: string): string {
  const basename = inputPath.replace(/\.[^.]+$/, "");
  const filename = basename.split(/[/\\]/).pop() ?? "output";
  return `${outputDir}/${filename}.pdf`;
}
