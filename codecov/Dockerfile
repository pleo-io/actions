FROM alpine 

RUN apk add --no-cache curl bash git
RUN curl -s https://codecov.io/bash > /codecov.sh

ENTRYPOINT ["bash", "/codecov.sh"]
