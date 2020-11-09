### Description

Trigger a `workflow_dispatch` event in GitHub. The dispatch event is targeted to the same
repository as the calling action, and at the workflow specified by the `WORKFLOW_DISPATCH_FILE_NAME`.

Chained workflows can be turned off and on, typically useful so that regular, every day
CICD pipelines can run the full suite of actions, while a rollback or reversion action,
manually applied by a user, can run just a single workflow at a time.

### Usage

```yaml

- name: Trigger production deployment
  if: github.event.inputs.env  == 'staging' && github.event.inputs.allow_chained_workflows == 'true'
  uses: pleo-io/actions/trigger-workflow-dispatch@v9.1
  with:
    WORKFLOW_DISPATCH_FILE_NAME: "deploy_primary.yaml"
    GITHUB_DISPATCH_WORKFLOW_TOKEN: ${{ secrets.WORKFLOW_DISPATCH_DEPLOYMENTS }}
    ENV: "production"
    ALLOW_CHAINED_DEPLOYMENTS: "true"

```
