FROM node:alpine

LABEL "com.github.actions.name"="comment pr deploy link"
LABEL "com.github.actions.description"="Comments the Pull request deployment link"
LABEL "com.github.actions.icon"="terminal"
LABEL "com.github.actions.color"="purple"

RUN apk --no-cache add jq curl

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
