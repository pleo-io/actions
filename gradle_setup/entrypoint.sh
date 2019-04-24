#!/bin/sh

-set -x -e +o pipefail

mkdir -p $HOME/.gradle

echo "
org.gradle.parallel=true
org.gradle.daemon=false
$MAVEN_REPOSITORY_USER_KEY=${MAVEN_REPOSITORY_USER}
$MAVEN_REPOSITORY_PASSWORD_KEY=${MAVEN_REPOSITORY_PASSWORD}" >> $HOME/.gradle/gradle.properties