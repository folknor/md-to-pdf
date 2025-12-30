# Policy Document

## Introduction

This example demonstrates the `@template` directive. Unlike `@include` which uses file paths, templates are defined in config and referenced by name.

## How It Works

1. Define templates in your config file:

```yaml
templates:
  legal: path/to/legal-footer.md
  approval: path/to/approval-block.md
```

2. Use them by name in your markdown:

```markdown
@template legal
@template approval
```

## Benefits Over @include

- **Centralized management**: Template paths defined once in config
- **Cleaner markdown**: Short names instead of full paths
- **Easy to swap**: Change template path in config, all documents update
- **Portable**: Documents work regardless of directory structure

## @template vs @include

| Feature | @include | @template |
|---------|----------|-----------|
| Path type | File path | Name from config |
| Defined in | Markdown file | Config file |
| Best for | One-off includes | Reusable org-wide templates |

## Document Content

This is where your actual document content would go...

@template approval

@template legal
