#!/bin/sh
set -e


echo GITHUB_HEAD_REF=$GITHUB_HEAD_REF
echo GITHUB_REF=$GITHUB_REF
if [ -z "$GITHUB_HEAD_REF" ]
then
echo "\$GITHUB_HEAD_REF is empty"
BN=${GITHUB_REF#"refs/heads/"}
else
echo "\$GITHUB_HEAD_REF is NOT empty"
BN=$GITHUB_HEAD_REF
fi


# Trimming and replacing characters to make URL user friendly
BN=$(echo "$BN" | tr '/_.' '-')
BN=$(echo "$BN" | cut -c1-40)

# Abort if can't create branch name, as safety precaution
if [ -z "$BN" ]
then
echo "\$BN is empty"
exit 1
fi

echo BN=$BN
echo ::set-output name=branch_name::${BN}