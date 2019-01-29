FROM alpine 

LABEL "Name"="Codecov"
LABEL "Version"="1.0.0"
LABEL "Maintainer"="Pleo"

LABEL "com.github.actions.name"="Codecov"
LABEL "com.github.actions.description"="Uploads code coverage to codecov"
LABEL "com.github.actions.icon"="code"
LABEL "com.github.actions.color"="pink"

RUN apk add --no-cache curl bash git
RUN curl -s https://codecov.io/bash > /codecov.sh

ENTRYPOINT ["bash", "/codecov.sh"]
