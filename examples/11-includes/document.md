---
theme: beryl
---

# Project Proposal

@include ./shared/company-info.md

## Executive Summary

This document demonstrates the `@include` directive, which lets you reuse content across multiple documents.

## How It Works

Use `@include` followed by a path:

```
@​include ./shared/header.md
@​include /absolute/path/to/file.md
@​include "path with spaces/file.md"
```

Paths can be:
- **Relative** to the current file: `./shared/header.md`
- **Absolute**: `/home/user/templates/footer.md`
- **Quoted** for paths with spaces: `"My Templates/header.md"`

## Benefits

- Keep shared content in one place
- Update once, reflect everywhere
- Cleaner, more maintainable documents
- Includes can be nested (files can include other files)

## Conclusion

The `@include` directive is perfect for:
- Company letterheads
- Legal disclaimers
- Standard sections
- Shared definitions

@include ./shared/disclaimer.md
