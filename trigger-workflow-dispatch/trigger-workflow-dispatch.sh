curl \
--fail --silent --show-error \
-H "Accept: application/vnd.github.v3+json" \
-H "Authorization: token $WORKFLOW_DISPATCH_DEPLOYMENTS" \
https://api.github.com/repos/pleo-io/callisto/actions/workflows/deploy_primary_dispatch.yaml/dispatches \
--data-binary @- << EOF
{
  "ref": "refs/heads/master",
  "inputs": {
    "sha": "${GITHUB_SHA}",
    "env": "staging"
  }
}
EOF