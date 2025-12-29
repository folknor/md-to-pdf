import type { MarkedExtension } from "marked";

// Using dynamic imports for CommonJS modules
const diacritics = await import("diacritics-map").then((m) => m.default || m);
const stripColor = await import("strip-color").then((m) => m.default || m);

export function getTitle(str: string) {
	if (/^\[[^\]]+\]\(/.test(str)) {
		const m = /^\[([^\]]+)\]/.exec(str);
		if (m) return m[1];
	}
	return str;
}

function replaceDiacritics(str: string) {
	return str.replace(/[À-ž]/g, (ch) => {
		return diacritics[ch] || ch;
	});
}

export function sluggify(input: string) {
	let str = getTitle(input) ?? "";
	str = str.trim(); // Remove leading/trailing whitespace and linebreaks
	str = str.replace(/\r?\n|\r/g, ""); // Remove all linebreaks
	str = stripColor(str) as string;
	str = str.toLowerCase();

	// `.split()` is often (but not always) faster than `.replace()`
	str = str.split(" ").join("-");
	str = str.split(/\t/).join("--");
	str = str.split(/[|$&`~=\\/@+*!?({[\]})<>=.,;:'"^]/).join("");
	str = str
		.split(/[。？！，、；：""【】（）〔〕［］﹃﹄" "''﹁﹂—…－～《》〈〉「」]/)
		.join("");
	str = replaceDiacritics(str);
	return str;
}

/**
 * Add `id` attribute to headings (h1, h2, h3, etc) like GitHub.
 * Handles duplicate headings by appending -1, -2, etc.
 *
 * @returns A {@link MarkedExtension} to be passed to {@link marked.use | `marked.use()`}
 */
export function gfmHeadingId(): MarkedExtension {
	const seen: Record<string, number> = {};

	return {
		walkTokens(token) {
			if (token.type === "heading") {
				const baseSlug = sluggify((token as { text: string }).text);
				let slug = baseSlug;

				// Handle duplicates by appending -1, -2, etc.
				if (seen[baseSlug] !== undefined) {
					seen[baseSlug]++;
					slug = `${baseSlug}-${seen[baseSlug]}`;
				} else {
					seen[baseSlug] = 0;
				}

				// biome-ignore lint/suspicious/noExplicitAny: marked token extension
				(token as any).id = slug;
			}
		},
		renderer: {
			heading(token) {
				// biome-ignore lint/suspicious/noExplicitAny: marked token extension
				const id = (token as any).id;
				return `<h${token.depth} id="${id}">${token.text}</h${token.depth}>\n`;
			},
		},
	};
}
