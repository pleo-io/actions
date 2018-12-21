FROM node:10-slim

LABEL version="1.0.0"
LABEL repository="https://github.com/pleo-io/actions/npm"
LABEL homepage="https://github.com/pleo-io/actions/npm"
LABEL maintainer="Pleo Dev <dev@pleo.io>"

LABEL com.github.actions.name="GitHub Action for npm"
LABEL com.github.actions.description="Wraps the npm CLI to enable common npm commands."
LABEL com.github.actions.icon="package"
LABEL com.github.actions.color="red"

COPY "entrypoint.sh" "/entrypoint.sh"
ENTRYPOINT ["/entrypoint.sh"]
CMD ["help"]
