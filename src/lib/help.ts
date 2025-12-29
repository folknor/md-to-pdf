const helpText = `
  Usage: md-to-pdf [options] <files...>

  Options:

    -h, --help              Output usage information
    -v, --version           Output version
    --as-html               Output as HTML instead of PDF
    --config-file <path>    Path to a YAML configuration file

  Examples:

    $ md-to-pdf file.md
    $ md-to-pdf file1.md file2.md file3.md
    $ md-to-pdf *.md
    $ md-to-pdf --as-html README.md
    $ md-to-pdf --config-file config.yaml docs/*.md

  Config files use YAML format. Use @filename to reference external files:

    pdf_options:
      headerTemplate: "@header.html"
      footerTemplate: "@footer.html"
    stylesheet:
      - "@style.css"

  Front-matter in markdown files can override config settings.
`;

export const help = () => console.log(helpText);
