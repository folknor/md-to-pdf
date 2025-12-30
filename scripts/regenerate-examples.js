#!/usr/bin/env node

import { promises as fs } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const examplesDir = join(__dirname, '..', 'examples');
const cliPath = join(__dirname, '..', 'dist', 'cli.js');

async function regenerateExamples() {
	try {
		// Read all directories in examples
		const entries = await fs.readdir(examplesDir, { withFileTypes: true });
		const exampleDirs = entries
			.filter(e => e.isDirectory())
			.map(e => e.name)
			.sort();

		console.log(`Found ${exampleDirs.length} examples\n`);

		for (const dir of exampleDirs) {
			const examplePath = join(examplesDir, dir);
			const markdownFile = join(examplePath, 'document.md');

			// Check if document.md exists
			try {
				await fs.access(markdownFile);
			} catch {
				console.log(`⚠ Skipping ${dir}: no document.md found`);
				continue;
			}

			const outputFile = join(examplePath, 'document.pdf');

			try {
				console.log(`Generating ${dir}...`);
				execSync(`node "${cliPath}" "${markdownFile}" -o "${outputFile}"`, {
					stdio: 'pipe',
				});
				console.log(`✓ ${dir}\n`);
			} catch (error) {
				console.error(`✗ Failed to generate ${dir}`);
				console.error(error.message);
				process.exit(1);
			}
		}

		console.log('All examples regenerated successfully!');
	} catch (error) {
		console.error('Error:', error.message);
		process.exit(1);
	}
}

regenerateExamples();
