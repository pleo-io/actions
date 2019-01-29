# Codecov action

Runs codecov in a quite compact maneer.

## Usage

```
action "Codecov" {
  uses = "pleo-io/actions/codecov@master"
  needs = ["tests"]
  secrets = ["CODECOV_TOKEN"]
}
```