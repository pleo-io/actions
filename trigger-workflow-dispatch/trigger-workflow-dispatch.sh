#!/bin/sh

env
echo endpoint = "https://api.github.com/repos/${GITHUB_REPOSITORY}/actions/workflows/${INPUT_WORKFLOW_DISPATCH_FILE_NAME}/dispatches"
echo ref = "${INPUT_WORKFLOW_FILE_REF}"
echo sha = "${GITHUB_SHA}"
echo env = "${INPUT_ENV}"



curl \
--fail --silent --show-error \
-H "Accept: application/vnd.github.v3+json" \
-H "Authorization: token ${INPUT_GITHUB_DISPATCH_WORKFLOW_TOKEN}" \
"https://api.github.com/repos/${GITHUB_REPOSITORY}/actions/workflows/${INPUT_WORKFLOW_DISPATCH_FILE_NAME}/dispatches" \
--data-binary @- << EOF
{
  "ref": "${INPUT_WORKFLOW_FILE_REF}",
  "inputs": {
    "sha": "${GITHUB_SHA}",
    "env": "${INPUT_ENV}"
  }
}
EOF
