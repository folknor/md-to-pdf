#!/usr/bin/env node

import { promises as fs } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import arg from "arg";
import Listr from "listr";
import YAML from "yaml";
import { type Config, defaultConfig } from "./lib/config.js";
import { closeBrowser } from "./lib/generate-output.js";
import { help } from "./lib/help.js";
import { convertMdToPdf } from "./lib/md-to-pdf.js";
import { resolveFileRefs } from "./lib/resolve-file-refs.js";

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

main(cliFlags).catch((error) => {
	console.error(error);
	process.exit(1);
});

// --
// Define Main Function

async function main(args: typeof cliFlags) {
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

	let config: Config = { ...defaultConfig };

	if (args["--config-file"]) {
		try {
			const configFilePath = resolve(args["--config-file"]);
			const configContent = await fs.readFile(configFilePath, "utf-8");
			const configFile = await resolveFileRefs(
				YAML.parse(configContent) as Partial<Config>,
				dirname(configFilePath),
			);

			config = {
				...config,
				...configFile,
				pdf_options: { ...config.pdf_options, ...configFile.pdf_options },
			};
		} catch (error) {
			console.warn(`Warning: couldn't read config file: ${resolve(args["--config-file"])}`);
			console.warn(error instanceof Error ? error.message : error);
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
