FROM ubuntu:18.04
RUN apt-get update
RUN apt-get install -y curl

COPY trigger-workflow-dispatch.sh /trigger-workflow-dispatch.sh
ENTRYPOINT ["/trigger-workflow-dispatch.sh"]
