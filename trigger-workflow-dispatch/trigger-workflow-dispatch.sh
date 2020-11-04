#!/bin/sh

curl \
--fail --silent --show-error \
-H "Accept: application/vnd.github.v3+json" \
-H "Authorization: token ${GITHUB_DISPATCH_WORKFLOW_TOKEN}" \
https://api.github.com/repos/${GITHUB_REPOSITORY}/actions/workflows/${WORKFLOW_DISPATCH_FILE_NAME}/dispatches \
--data-binary @- << EOF
{
  "ref": "${WORKFLOW_FILE_REF}",
  "inputs": {
    "sha": "${GITHUB_SHA}",
    "env": "${ENV}"
  }
}
EOF
