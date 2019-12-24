# dbt action

This action executes `dbt` commands. For information about `dbt`, please refer to the official [documentation](https://docs.getdbt.com/docs/introduction).

## Inputs

### `dbt-profiles-dir`

**Required** Path to folder containing the `profiles.yml` file.

### `dbt-project-dir`

**Required** Path to the `dbt` project folder.

### `dbt-command`

**Required** `dbt` command to execute.

### `dbt-target`

**Required** Target profile for `dbt` command.

## Example usage

uses: pleo/dbt-action@master
with:
  dbt-profiles-dir: './profiles'
  dbt-project-dir: './project'
  dbt-command: 'compile'
  dbt-target: 'dev'