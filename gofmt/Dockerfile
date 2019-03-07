FROM golang:1.11

LABEL "name"="go fmt action"
LABEL "maintainer"="Pierre-Alexandre St-Jean <pa@pleo.io>"
LABEL "version"="1.0.0"

LABEL "com.github.actions.name"="go fmt"
LABEL "com.github.actions.description"="Run go fmt"
LABEL "com.github.actions.icon"="terminal"
LABEL "com.github.actions.color"="blue"

RUN apt-get update
RUN apt-get install -y jq
RUN apt-get clean

COPY entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]