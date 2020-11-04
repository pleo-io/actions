### Description

Trigger a `workflow_dispatch` event in GitHub

### Usage

```yaml
- name: Set branch name
  id: set_branch_name
  uses: pleo-io/actions/sanitize-branch-for-dns@d5761200d4a09d1f722b3d473f7ebe143ec33368
  env:
    github_head_ref: ${{ github.event.pull_request.head.ref }}
    github_ref: ${{ github.event.pull_request.ref }}

- run: echo "${{ steps.set_branch_name.outputs.branch_name }}"
```

### Sanitization Rules

* If `github_head_ref` is not empty, use this vars value to proceed with rules
* If not, uuse `github_ref` and trim `/refs/heads/` prefix

1. Replace all `_` with `-`
2. Trim to 40 characters
3. Lowercase all letters
4. If last character is `-`, trim it
