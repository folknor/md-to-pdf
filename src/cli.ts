#!/usr/bin/env node

import { createRequire } from "node:module";
import path from "node:path";
import arg from "arg";
import Listr from "listr";
import { type Config, defaultConfig } from "./lib/config.js";
import { closeBrowser } from "./lib/generate-output.js";
import { help } from "./lib/help.js";
import { convertMdToPdf } from "./lib/md-to-pdf.js";

// --
// Configure CLI Arguments

export const cliFlags = arg({
	"--help": Boolean,
	"--version": Boolean,
	"--as-html": Boolean,
	"--config-file": String,

	// aliases
	"-h": "--help",
	"-v": "--version",
});

// --
// Run

main(cliFlags, defaultConfig).catch((error) => {
	console.error(error);
	process.exit(1);
});

// --
// Define Main Function

async function main(args: typeof cliFlags, config: Config) {
	process.title = "md-to-pdf";

	if (args["--version"]) {
		const require = createRequire(import.meta.url);
		const { version } = require("../package.json");
		return console.log(version);
	}

	if (args["--help"]) {
		return help();
	}

	const files = args._;

	if (files.length === 0) {
		return help();
	}

	/**
	 * 2. Read config file and merge it into the config object.
	 */

	if (args["--config-file"]) {
		try {
			const configFilePath = path.resolve(args["--config-file"]);

			// Handle both ES modules and CommonJS config files
			let configFile: Partial<Config>;

			if (configFilePath.endsWith(".cjs")) {
				// For .cjs files, use CommonJS require
				const require = createRequire(import.meta.url);
				configFile = require(configFilePath);
			} else if (configFilePath.endsWith(".js")) {
				// For .js files, try CommonJS require first (since most config files use CommonJS)
				// If that fails, fall back to ES module import
				try {
					const require = createRequire(import.meta.url);
					configFile = require(configFilePath);
				} catch (requireError) {
					// If CommonJS require fails, try ES module import
					try {
						const importedModule = await import(configFilePath);
						configFile = (importedModule as any).default || importedModule;
					} catch (importError) {
						// If both fail, rethrow the original require error
						throw requireError;
					}
				}
			} else {
				// For non-.js files, try to import with .js extension first, then .cjs
				try {
					const importPath = `${configFilePath}.js`;
					try {
						const require = createRequire(import.meta.url);
						configFile = require(importPath);
					} catch (requireError) {
						// If CommonJS require fails, try ES module import
						try {
							const importedModule = await import(importPath);
							configFile = (importedModule as any).default || importedModule;
						} catch (importError) {
							// Try .cjs extension
							const cjsImportPath = `${configFilePath}.cjs`;
							const require = createRequire(import.meta.url);
							configFile = require(cjsImportPath);
						}
					}
				} catch (error) {
					// If all attempts fail, rethrow
					throw error;
				}
			}

			config = {
				...config,
				...configFile,
				pdf_options: { ...config.pdf_options, ...configFile.pdf_options },
			};
		} catch (error) {
			console.warn(
				`Warning: couldn't read config file: ${path.resolve(args["--config-file"])}`,
			);
			console.warn(error instanceof SyntaxError ? error.message : error);
		}
	}

	const getListrTask = (file: string) => ({
		title: `generating ${args["--as-html"] ? "HTML" : "PDF"} from ${file}`,
		task: async () => convertMdToPdf({ path: file }, config, { args }),
	});

	await new Listr(files.map(getListrTask), {
		concurrent: true,
		exitOnError: false,
	})
		.run()
		.finally(async () => {
			await closeBrowser();
		});
}
