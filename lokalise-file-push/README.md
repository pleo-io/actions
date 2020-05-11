# lokalise-file-push

Lets you automatically push files to your lokalise.co project.

## How to use

```yaml
name: lokalise-file-push

on:
  push:
    # Only run workflow for pushes to specific branches
    branches:
      - master
    # Only run workflow when matching files are changed
    paths:
      - "src/locales/*/messages.po"

jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: igorDolzh/lokalise-file-push@v0.0.11
        with:
          # Api token for the Lokalise account
          # with read/write access to the project
          api-token: ${{ secrets.LOCALIZE_TOKEN }}

          # ID of the project to sync
          project-id: project-id

          # The relative file path where language files will be found
          file-path: src/locales/%LANG_ISO%/messages.po

          # Tag
          tag: tagName

          # Locales
          locales: '["en", "fr"]'
```
