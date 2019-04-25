#!/bin/sh

set -x -e +o pipefail

echo "
org.gradle.parallel=true
org.gradle.daemon=false
$MAVEN_REPOSITORY_USER_KEY=${MAVEN_REPOSITORY_USER}
$MAVEN_REPOSITORY_PASSWORD_KEY=${MAVEN_REPOSITORY_PASSWORD}" >> $GITHUB_WORKSPACE/gradle.properties
