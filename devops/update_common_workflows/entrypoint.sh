#!/bin/bash

# Headers for curl requests
HEADER_AUTH_TOKEN="Authorization: token ${GITHUB_TOKEN}"
HEADER_SHA="Accept: application/vnd.github.v3.sha"

ls -lah 

ls -lah /

# Set new branch name
if [ -z "$GHA_DEPLOY_BRANCH_NAME" ]; then
    GHA_DEPLOY_BRANCH_NAME="update_gha_source"
fi

# Save current folder
CURRENT_REPO_FOLDER=${PWD##*/}
echo "current repo = $CURRENT_REPO_FOLDER"
ls -lah

echo "path = "
pwd

echo "parent repo has"
ls -lah ../


# loop over all repos
numRepos=$(jq  '.repositories | length' /versions.json)
for i in $(seq 0 $((numRepos-1)))
do
    repo=$(jq  -r '.repositories | .['"$i"'] | .name' /versions.json)
    echo "repo is $repo"
    version=$(jq  -r '.repositories | .['"$i"'] | .version' /versions.json)
    echo "version is $version"

    # Clone the repo to be updated
    git clone https://${GITHUB_TOKEN}@github.com/pleo-io/${repo} ../${repo}
    cd ../${repo}

    git checkout ${version}

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
    RESPONSE=$(curl -s -H "${HEADER_AUTH_TOKEN}" -d '{"title":"Update Github Actions workflow, merge '${GHA_DEPLOY_BRANCH_NAME}' into 'master'","base":"master", "head":"'${GHA_DEPLOY_BRANCH_NAME}'"}' "https://api.github.com/repos/pleo-io/${repo}/pulls")

    # Check the status of the pull request
    PR_STATUS=$(echo ${RESPONSE} | jq '.state')
    if [[ $PR_STATUS != *"open"* ]]; then
        # Exit upon pull request failure. Would need further investigation into the offending repo.
        exit 1
    fi

    PR_NUMBER=$(echo ${RESPONSE} | jq '.number')

    # Wait for PR to fully open and stufffff
    sleep 5
    curl -X PUT -H "${HEADER_AUTH_TOKEN}" "https://api.github.com/repos/pleo-io/${repo}/pulls/${PR_NUMBER}/merge" -d '{"merge_method":"squash"}'

    # Clean up workspace
    cd ../
    ls -lah 
    # rm -rf ./${repo}
done