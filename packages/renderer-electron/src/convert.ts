/**
 * Backward-compatible conversion function for Electron.
 *
 * This wraps prepareConversion() from @mdforge/core and render() from this package.
 */

import { promises as fs } from "node:fs";
import process from "node:process";
import type { Config, ConversionInfo } from "@mdforge/core";
import { GenerationError } from "@mdforge/core/errors";
import { prepareConversion, type ConvertOptions } from "@mdforge/core/prepare";
import { render } from "./render.js";

/** Output from convertMdToPdf */
export interface ConvertResult {
  filename: string | undefined;
  content: Buffer | Uint8Array | string;
  info: ConversionInfo;
}

/**
 * Convert markdown to PDF or HTML using Electron.
 *
 * @param input - Markdown file path or content
 * @param config - Configuration
 * @param options - Optional arguments
 * @returns The conversion result
 */
export async function convertMdToPdf(
  input: { path: string } | { content: string },
  config: Config,
  {
    args = {},
  }: {
    args?: ConvertOptions;
  } = {},
): Promise<ConvertResult> {
  // Prepare the conversion (no browser needed)
  const prepared = await prepareConversion(input, config, args);

  // Render the document using Electron
  let output: Awaited<ReturnType<typeof render>>;
  try {
    output = await render(prepared);
  } catch (error) {
    const err = error as Error;
    const outputType = prepared.config.as_html ? "HTML" : "PDF";
    throw new GenerationError(
      `Failed to create ${outputType}: ${err.message}`,
      err,
    );
  }

  // Write output file if destination is set
  if (prepared.dest) {
    if (prepared.dest === "stdout") {
      process.stdout.write(output.content);
    } else {
      await fs.writeFile(prepared.dest, output.content);
    }
  }

  // Track output info
  if (prepared.dest) {
    prepared.info.output = {
      path: prepared.dest,
    };
  }

  return {
    filename: prepared.dest,
    content: output.content,
    info: prepared.info,
  };
}
