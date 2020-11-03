env

#curl \
#--fail --silent --show-error \
#-h "accept: application/vnd.github.v3+json" \
#-h "authorization: token $workflow_dispatch_deployments" \
#https://api.github.com/repos/pleo-io//actions/workflows/deploy_primary_dispatch.yaml/dispatches \
#--data-binary @- << eof
#{
#  "ref": "refs/heads/master",
#  "inputs": {
#    "sha": "${github_sha}",
#    "env": "${env}"
#  }
#}
#eof
