FROM ubuntu:latest

RUN apt update \
    && apt install -y curl \
    && apt install -y jq \
    && apt autoremove \
    && apt autoclean \
    && apt clean

ADD entrypoint.sh /entrypoint.sh
ADD versions.json /versions.json
RUN chmod +x /entrypoint.sh
RUN chmod +x /versions.json
ENTRYPOINT ["/entrypoint.sh"]
