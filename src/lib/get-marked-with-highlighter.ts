import hljs from "highlight.js";
import type { MarkedExtension, MarkedOptions } from "marked";
import { Marked } from "marked";
import { markedHighlight } from "marked-highlight";
import { markedSmartypants } from "marked-smartypants";
import { gfmHeadingId } from "./slugger.js";

export const getMarked = (
	options: MarkedOptions,
	extensions: MarkedExtension[],
) => {
	const highlightExtension = markedHighlight({
		langPrefix: "hljs language-",
		highlight(code, lang) {
			const language = hljs.getLanguage(lang) ? lang : "plaintext";
			return hljs.highlight(code, { language }).value;
		},
	});
	const headingIdExt = gfmHeadingId();
	const smartypantsExt = markedSmartypants();
	return new Marked(
		highlightExtension,
		headingIdExt,
		smartypantsExt,
		...extensions,
	).setOptions({ ...options });
};
