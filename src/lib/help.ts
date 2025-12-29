const helpText = `
  $ md-to-pdf [options] path/to/file.md

  Options:

    -h, --help ............... Output usage information
    -v, --version ............ Output version
    --as-html ................ Output as HTML instead of PDF
    --config-file ............ Path to a JS configuration file

  Examples:

  - Convert ./file.md and save to ./file.pdf

    $ md-to-pdf file.md

  - Convert all markdown files in current directory

    $ md-to-pdf ./*.md

  - Convert file.md but save as HTML instead

    $ md-to-pdf file.md --as-html

  - Convert file.md using a config file

    $ md-to-pdf file.md --config-file ./config.js
`;

export const help = () => console.log(helpText);
