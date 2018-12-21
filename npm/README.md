# GitHub Action for NPM

This Action for [npm](https://www.npmjs.com/) enables arbitrary actions with the `npm` command-line client, including testing packages and publishing to a registry. This is based on the [official GitHub npm actions](https://github.com/actions/npm).

## Usage

An example workflow to build, test, and publish an npm package to the default public registry follows:

```hcl
workflow "Build, Test, and Publish" {
  on = "push"
  resolves = ["Publish"]
}

action "Build" {
  uses = "pleo-io/actions/npm@master"
  args = "install"
}

action "Test" {
  needs = "Build"
  uses = "pleo-io/actions/npm@master"
  args = "test"
}

# Filter for a new tag
action "Tag" {
  needs = "Test"
  uses = "pleo-io/actions/bin/filter@master"
  args = "tag"
}

action "Publish" {
  needs = "Tag"
  uses = "pleo-io/actions/npm@master"
  args = "publish --access public"
  secrets = ["NPM_AUTH_TOKEN"]
}
```

### Secrets

* `NPM_AUTH_TOKEN` - **Optional**. The token to use for authentication with the npm registry. Required for `npm publish` ([more info](https://docs.npmjs.com/getting-started/working_with_tokens))

### Environment variables

* `BRANCH` - **Optional**. To specify the branch where this action should be executed. Useful to only run commands on specific branches
* `NPM_REGISTRY_URL` - **Optional**. To specify a registry to authenticate with. Defaults to `registry.npmjs.org`
* `NPM_CONFIG_USERCONFIG` - **Optional**. To specify a non-default per-user configuration file. Defaults to `$HOME/.npmrc` ([more info](https://docs.npmjs.com/misc/config#npmrc-files))

#### Example

To authenticate with, and publish to, a registry other than `registry.npmjs.org`:

```hcl
action "Publish" {
  uses = "actions/npm@master"
  args = "publish --access public"
  env = {
    NPM_REGISTRY_URL = "someOtherRegistry.someDomain.net"
  }
  secrets = ["NPM_AUTH_TOKEN"]
}
```

## License

The Dockerfile and associated scripts and documentation in this project are released under the [MIT License](LICENSE).

Container images built with this project include third party materials. See [THIRD_PARTY_NOTICE.md](THIRD_PARTY_NOTICE.md) for details.
