import { promises as fs } from "node:fs";
import { resolve } from "node:path";

/**
 * Recursively resolve @filename references in config values.
 * References are resolved relative to the baseDir.
 */
export async function resolveFileRefs<T>(
	value: T,
	baseDir: string,
): Promise<T> {
	if (typeof value === "string" && value.startsWith("@")) {
		const filePath = resolve(baseDir, value.slice(1));
		return (await fs.readFile(filePath, "utf-8")) as T;
	}

	if (Array.isArray(value)) {
		return Promise.all(
			value.map((item) => resolveFileRefs(item, baseDir)),
		) as Promise<T>;
	}

	if (value !== null && typeof value === "object") {
		const result: Record<string, unknown> = {};
		for (const [key, val] of Object.entries(value)) {
			result[key] = await resolveFileRefs(val, baseDir);
		}
		return result as T;
	}

	return value;
}
