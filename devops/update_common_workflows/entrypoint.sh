#!/bin/bash

set -e
base_dir=${PWD}
git config --global user.email "gha@gha"
git config --global user.name "GHA"

# Headers for curl requests
HEADER_AUTH_TOKEN="Authorization: token ${GITHUB_TOKEN}"
HEADER_SHA="Accept: application/vnd.github.v3.sha"

# Set new branch name
if [ -z "$GHA_DEPLOY_BRANCH_NAME" ]; then
    GHA_DEPLOY_BRANCH_NAME="update_gha_source"
fi


# get workflow library repo
git clone https://${GITHUB_TOKEN}@github.com/pleo-io/gh-actions-test ${base_dir}/gh-actions-test


# loop over all repos
numRepos=$(jq  '.repositories | length' /versions.json)
for i in $(seq 0 $((numRepos-1)))
do
    cd $base_dir
    echo -e "\n\nbeginning new repo process\n\n"
    repo=$(jq  -r '.repositories | .['"$i"'] | .name' /versions.json)
    version=$(jq  -r '.repositories | .['"$i"'] | .version' /versions.json)
    files=$(jq  -r '.repositories | .['"$i"'] | .files | join(",")' /versions.json)
    echo "repo is $repo"
    echo "version is $version"
    echo "files is $files"

    # set version of version to update from
    cd ${base_dir}/gh-actions-test
    git reset --hard ${version}

    # Clone the repo to be updated
    git clone https://${GITHUB_TOKEN}@github.com/pleo-io/${repo} ${base_dir}/${repo}
    cd ${base_dir}/${repo}
    branch=$(git rev-parse --abbrev-ref HEAD)
    echo "branch = $branch"

    git checkout -b ${GHA_DEPLOY_BRANCH_NAME}

    # Copy updated Github Action workflow files to the repo
    echo "copy string = ${base_dir}/gh-actions-test/${GHA_DEPLOYMENT_FOLDER}/.github/workflows/{${files}}"
    cp -r ${base_dir}/gh-actions-test/${GHA_DEPLOYMENT_FOLDER}/.github/workflows/{${files}} .
    git add .github/*

    if [ -z "$COMMIT_MESSAGE" ]; then
        COMMIT_MESSAGE="Updating Github Action workflows."
    fi

    # if nothing to commit, skip
    committed=$(git commit -m "${COMMIT_MESSAGE}")
    if [[ "$committed" == *"nothing to commit"* ]]; then
        echo "nothing to change in $repo, skipping"
        continue
    fi


    git push -f origin ${GHA_DEPLOY_BRANCH_NAME}

    # Create pull request from new branch into development branch
    RESPONSE=$(curl -s -H "${HEADER_AUTH_TOKEN}" -d '{"title":"Update Github Actions workflow, merge '${GHA_DEPLOY_BRANCH_NAME}' into '${branch}'","base":"'${branch}'", "head":"'${GHA_DEPLOY_BRANCH_NAME}'"}' "https://api.github.com/repos/pleo-io/${repo}/pulls")
    echo "response = $RESPONSE"

    # Check the status of the pull request
    PR_STATUS=$(echo ${RESPONSE} | jq '.state')
    if [[ $PR_STATUS != *"open"* ]]; then
        # Exit upon pull request failure. Would need further investigation into the offending repo.
        echo "this PR isnt open or something. debug yo, PR status = $PR_STATUS"
        exit 1
    fi

    PR_NUMBER=$(echo ${RESPONSE} | jq '.number')

    # Wait for PR to fully open and stufffff
    sleep 5
    curl -X PUT -H "${HEADER_AUTH_TOKEN}" "https://api.github.com/repos/pleo-io/${repo}/pulls/${PR_NUMBER}/merge" -d '{"merge_method":"squash"}'

    # Clean up workspace
    echo -e "\nend $repo process\n"
done