import type { Config } from "./config.js";
import { getMarked } from "./get-marked-with-highlighter.js";
import { insertToc } from "./toc.js";

/**
 * Generates a HTML document from a markdown string and returns it as a string.
 */
export const getHtml = (md: string, config: Config) => {
	const mdWithToc = insertToc(md, config.toc_options);
	return `<!DOCTYPE html>
<html>
	<head><title>${config.document_title}</title><meta charset="utf-8"></head>
	<body class="${config.body_class.join(" ")}">
		${getMarked(config.marked_options, config.marked_extensions).parse(mdWithToc)}
	</body>
</html>
`;
};
