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

dbt $dbt_command --profiles-dir $dbt_profiles_dir --project-dir $dbt_project_dir --target $dbt_target