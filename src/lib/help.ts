const helpText = `
  Usage: md-to-pdf [options] <files...>

  Options:

    -h, --help              Output usage information
    -v, --version           Output version
    --as-html               Output as HTML instead of PDF
    --config-file <path>    Path to a JS configuration file

  Examples:

    $ md-to-pdf file.md
    $ md-to-pdf file1.md file2.md file3.md
    $ md-to-pdf *.md
    $ md-to-pdf --as-html README.md
    $ md-to-pdf --config-file config.js docs/*.md
`;

export const help = () => console.log(helpText);
