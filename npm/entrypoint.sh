#!/bin/sh

set -e

CURRENT_BRANCH=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')

if [! -z "$BRANCH" ] && [ "$CURRENT_BRANCH" != "$BRANCH" ]
then
    echo "Current branch '$CURRENT_BRANCH' does not match branch '$BRANCH'. Skipping execution of command."
    exit 78
fi

if [ -n "$NPM_AUTH_TOKEN" ]; then
  # Respect NPM_CONFIG_USERCONFIG if it is provided, default to $HOME/.npmrc
  NPM_CONFIG_USERCONFIG="${NPM_CONFIG_USERCONFIG-"$HOME/.npmrc"}"
  NPM_REGISTRY_URL="${NPM_REGISTRY_URL-registry.npmjs.org}"

  # Allow registry.npmjs.org to be overridden with an environment variable
  printf "//$NPM_REGISTRY_URL/:_authToken=$NPM_AUTH_TOKEN\nregistry=$NPM_REGISTRY_URL" > "$NPM_CONFIG_USERCONFIG"
  chmod 0600 "$NPM_CONFIG_USERCONFIG"
fi

sh -c "npm $*"
