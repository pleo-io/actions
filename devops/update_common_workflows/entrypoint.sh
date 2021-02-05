#!/bin/bash

set -x

# Headers for curl requests
HEADER_AUTH_TOKEN="Authorization: token ${GITHUB_TOKEN}"
HEADER_SHA="Accept: application/vnd.github.v3.sha"

# Set new branch name
if [ -z "$GHA_DEPLOY_BRANCH_NAME" ]; then
    GHA_DEPLOY_BRANCH_NAME="update_gha_source"
fi

# Save current folder
CURRENT_REPO_FOLDER=${PWD##*/}

echo $CURRENT_REPO_FOLDER

# Clone the repo to be updated
git clone https://${GITHUB_TOKEN}@github.com/${USER}/${REPOSITORY} ../${REPOSITORY}

cd ../${REPOSITORY}

git checkout ${DEVELOPMENT_BRANCH}

git checkout -b ${GHA_DEPLOY_BRANCH_NAME}

# Fake user to satisfy Github's curiosity
git config --local user.email "gha@gha"
git config --local user.name "GHA"

# Copy updated Github Action workflow files to the repo
cp -r ../${CURRENT_REPO_FOLDER}/${GHA_DEPLOYMENT_FOLDER}/.github/ .

git add .github/*

if [ -z "$COMMIT_MESSAGE" ]; then
    COMMIT_MESSAGE="Updating Github Action workflows."
fi

git commit -m "${COMMIT_MESSAGE}"

git push -f origin ${GHA_DEPLOY_BRANCH_NAME}

# Create pull request from new branch into development branch
RESPONSE=$(curl -s -H "${HEADER_AUTH_TOKEN}" -d '{"title":"Update Github Actions workflow, merge '${GHA_DEPLOY_BRANCH_NAME}' into '${DEVELOPMENT_BRANCH}'","base":"'${DEVELOPMENT_BRANCH}'", "head":"'${GHA_DEPLOY_BRANCH_NAME}'"}' "https://api.github.com/repos/${USER}/${REPOSITORY}/pulls")

 # Check the status of the pull request
PR_STATUS=$(echo ${RESPONSE} | jq '.state')
if [[ $PR_STATUS != *"open"* ]]; then
    # Exit upon pull request failure. Would need further investigation into the offending repo.
    exit 1
fi

PR_NUMBER=$(echo ${RESPONSE} | jq '.number')
curl -H "${HEADER_AUTH_TOKEN}" -d '{"labels": ["automerge", "gh_action"]}' "https://api.github.com/repos/${USER}/${REPOSITORY}/issues/${PR_NUMBER}/labels"

# Wait for PR to fully open and stufffff
sleep 5

curl -X PUT -H "${HEADER_AUTH_TOKEN}" "https://api.github.com/repos/${USER}/${REPOSITORY}/pulls/${PR_NUMBER}/merge" -d '{"merge_method":"squash"}'

set +x 
