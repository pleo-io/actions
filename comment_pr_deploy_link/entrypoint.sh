#!/bin/sh
set -e

SANITIZED_BRANCH_NAME=$(echo "$BRANCH_NAME" | tr ".\\/+" "-")
SANITIZED_PROJECT_NAME=$(echo "$PROJECT_NAME" | tr ".\\/+" "-")
COMMENT="The app for PR is available at https://$SANITIZED_BRANCH_NAME.$SANITIZED_PROJECT_NAME.staging.pleo.io"

PAYLOAD=$(echo '{}' | jq --arg body "$COMMENT" '.body = $body')

curl -s -S -H "Authorization: token $GITHUB_TOKEN" --header "Content-Type: application/json" --data "$PAYLOAD" "$COMMENTS_URL" > /dev/null
