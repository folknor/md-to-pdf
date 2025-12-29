import GithubSlugger from "github-slugger";
import type { MarkedExtension } from "marked";

/**
 * Add `id` attribute to headings (h1, h2, h3, etc) like GitHub.
 * Handles duplicate headings by appending -1, -2, etc.
 *
 * @returns A {@link MarkedExtension} to be passed to {@link marked.use | `marked.use()`}
 */
export function gfmHeadingId(): MarkedExtension {
	const slugger = new GithubSlugger();

	return {
		walkTokens(token) {
			if (token.type === "heading") {
				// biome-ignore lint/suspicious/noExplicitAny: marked token extension
				(token as any).id = slugger.slug((token as { text: string }).text);
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
