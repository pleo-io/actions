# lokalise-create-task

Lets you create a task for localise

## How to use

```yaml
name: lokalise-create-task

on:
  push:
    # Only run workflow for pushes to specific branches
    branches:
      - master

jobs:
  upload:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - uses: pleo-io/actions/lokalise-file-push
        with:
          # Api token for the Lokalise account
          # with read/write access to the project
          api-token: ${{ secrets.LOCALIZE_TOKEN }}

          # ID of the project to sync
          project-id: project-id

          # Tags
          tags: '["tagName","tagName1"]'

          # Name of team from localise
          team-name: Pleo team

          # List of email for task assignee
          assignee-email-list: '{
            "en": ["igor@pleo.io", "sam@pleo.io"],
            "fr": ["igor@pleo.io", "sam@pleo.io"],
            "de": ["igor@pleo.io", "sam@pleo.io"],
            "es": ["igor@pleo.io", "sam@pleo.io"],
            "sv": ["igor@pleo.io", "sam@pleo.io"],
            "da": ["igor@pleo.io", "sam@pleo.io"]
          }'

          # Task title
          task-title: Hello, it is a task title

          # Task description
          task-description: Hello, it is a task description

          # Task options for https://app.lokalise.com/api2docs/curl/#transition-create-a-task-post
          task-options: "{'auto_close_task': true, 'auto_close_languages': true}"
```
