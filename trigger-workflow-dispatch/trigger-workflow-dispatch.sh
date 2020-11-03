curl \
--fail --silent --show-error \
-h "accept: application/vnd.github.v3+json" \
-h "authorization: token $workflow_dispatch_deployments" \
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
