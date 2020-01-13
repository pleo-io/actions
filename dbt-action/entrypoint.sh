#!/bin/sh
set -e

if [ "$#" -ne 2 ]; then
    printf "Illegal number of parameters\n"
    exit 1
fi

dbt_project_dir=$1
dbt_command=$2

cd $dbt_project_dir

printf "Running dbt with command %s\n" "$dbt_command"

dbt $dbt_command