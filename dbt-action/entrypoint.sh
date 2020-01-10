#!/bin/sh
set -e

if [ "$#" -ne 4 ]; then
    printf "Illegal number of parameters\n"
    exit 1
fi

dbt_profiles_dir=$1
dbt_project_dir=$2
dbt_command=$3
dbt_target=$4

printf "Using profiles from dir %s:\n" "$dbt_profiles_dir"
printf '%b\n' "$(cat $dbt_profiles_dir/profiles.yml)"

printf "Running dbt project in folder %s with command %s on target %s\n" "$dbt_project_dir" "$dbt_command" "$dbt_target"

# dbt $dbt_command --profiles-dir $dbt_profiles_dir --project-dir $dbt_project_dir --target $dbt_target
dbt compile -h