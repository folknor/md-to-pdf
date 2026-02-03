/**
 * Backward-compatible conversion function.
 *
 * This wraps prepareConversion() from @mdforge/core and render() from this package
 * to provide the same API as the original convertMdToPdf().
 */

import { promises as fs } from "node:fs";
import process from "node:process";
import type { Config, ConversionInfo } from "@mdforge/core";
import { GenerationError } from "@mdforge/core/errors";
import { type ConvertOptions, prepareConversion } from "@mdforge/core/prepare";
import type { Browser } from "puppeteer";
import { render } from "./render.js";

/** Output from convertMdToPdf */
export interface ConvertResult {
  filename: string | undefined;
  content: Buffer | Uint8Array | string;
  info: ConversionInfo;
}

/**
 * Convert markdown to PDF or HTML.
 *
 * This is the main entry point for CLI and other consumers.
 * It combines preparation (from @mdforge/core) with rendering (from this package).
 *
 * @param input - Markdown file path or content
 * @param config - Configuration
 * @param options - Optional arguments and browser instance
 * @returns The conversion result
 */
export async function convertMdToPdf(
  input: { path: string } | { content: string },
  config: Config,
  {
    args = {},
    browser,
  }: {
    args?: ConvertOptions;
    browser?: Browser;
  } = {},
): Promise<ConvertResult> {
  // Prepare the conversion (no browser needed)
  const prepared = await prepareConversion(input, config, args);

  // Render the document
  let output: Awaited<ReturnType<typeof render>>;
  try {
    output = await render(prepared, browser);
  } catch (error) {
    const err = error as Error;
    const outputType = prepared.config.as_html ? "HTML" : "PDF";
    // Provide context about what failed
    if (err.message.includes("Browser") || err.message.includes("browser")) {
      throw new GenerationError(
        `Failed to create ${outputType}: Could not launch browser. Is Puppeteer installed correctly?`,
        err,
      );
    }
    if (err.message.includes("timeout") || err.message.includes("Timeout")) {
      throw new GenerationError(
        `Failed to create ${outputType}: Page load timed out. Check for slow-loading resources.`,
        err,
      );
    }
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
