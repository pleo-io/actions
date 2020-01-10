#!/bin/sh
set -e

if [ $# -eq 0 ]
  then
    echo "No arguments supplied"
    exit 1
fi

dbt_command=$1

printf "Using profiles from dir %s:\n" "$dbt_profiles_dir"
printf '%b\n' "$(cat $dbt_profiles_dir/profiles.yml)"

printf "Running dbt with command %s\n" "$dbt_command"

dbt $dbt_command