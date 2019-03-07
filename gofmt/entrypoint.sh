#!/bin/sh
set -e

cd "${GO_WORKING_DIR:-.}"

# Check if any files are not formatted and Exit if `go fmt` passes.
if [ -z "$(gofmt -l -d -e $(find . -type f -iname '*.go'))" ]; then
  exit 0
fi

# Get list of unformatted files.
FILES=$(sh -c 'gofmt -l . $*')

# Iterate through each unformatted file.
OUTPUT=""
for file in $FILES; do
DIFF=$(gofmt -d -e "$file")
OUTPUT="$OUTPUT
\`$file\`

\`\`\`diff
$DIFF
\`\`\`
"
done

# Post results back as comment.
COMMENT="#### \`go fmt\`
$OUTPUT
"
PAYLOAD=$(echo '{}' | jq --arg body "$COMMENT" '.body = $body')
COMMENTS_URL=$(jq -r .pull_request.comments_url < /github/workflow/event.json)
curl -s -S -H "Authorization: token $GITHUB_TOKEN" --header "Content-Type: application/json" --data "$PAYLOAD" "$COMMENTS_URL" > /dev/null

exit 1
