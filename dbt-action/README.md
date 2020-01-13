# dbt action

This action executes `dbt` commands. For information about `dbt`, please refer to the official [documentation](https://docs.getdbt.com/docs/introduction).

## Inputs

### `dbt-project-dir`

**Required** Path to the `dbt` project folder.

### `dbt-command`

**Required** `dbt` command to execute.

## Example usage

uses: pleo-io/actions/dbt-action@master
with:
  dbt-project-dir: './project'
  dbt-command: 'compile'