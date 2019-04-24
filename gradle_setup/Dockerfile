FROM busybox

LABEL "name"="Setup gradle"
LABEL "maintainer"="Pierre-Alexandre St-Jean <pa@pleo.io>"
LABEL "version"="1.0.0"

LABEL "com.github.actions.icon"="code"
LABEL "com.github.actions.color"="green-dark"
LABEL "com.github.actions.name"="gotest"
LABEL "com.github.actions.description"="This is an action that sets up gradle."

ENV GO111MODULE=on
COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
