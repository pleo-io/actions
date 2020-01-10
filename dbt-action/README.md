# dbt action

This action executes `dbt` commands. For information about `dbt`, please refer to the official [documentation](https://docs.getdbt.com/docs/introduction).

## Inputs

### `dbt-command`

**Required** `dbt` command to execute.

## Example usage

uses: pleo-io/actions/dbt-action@master
with:
  dbt-command: 'compile'