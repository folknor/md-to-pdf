import type { MarkedExtension } from "marked";

/**
 * Add `id` attribute to headings (h1, h2, h3, etc) like GitHub.
 *
 * @returns A {@link MarkedExtension} to be passed to {@link marked.use | `marked.use()`}
 */
export function gfmHeadingId(): MarkedExtension;
