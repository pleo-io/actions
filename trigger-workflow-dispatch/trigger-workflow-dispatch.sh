#!/bin/sh

curl \
--fail --silent --show-error \
-H "Accept: application/vnd.github.v3+json" \
-H "Authorization: token $WORKFLOW_DISPATCH_FILE_NAME" \
https://api.github.com/repos/${GITHUB_REPOSITORY}/actions/workflows/deploy_primary_dispatch.yaml/dispatches \
--data-binary @- << EOF
{
  "ref": "${WORKFLOW_FILE_REF}",
  "inputs": {
    "sha": "${GITHUB_SHA}",
    "env": "${ENV}"
  }
}
EOF
