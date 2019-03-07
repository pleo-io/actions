#!/usr/bin/env bash

-set -x -e +o pipefail

export GOPATH=${HOME}/go
export GO111MODULE=on

touch ./coverage.tmp
echo 'mode: atomic' > coverage.txt
go list ./... | grep -v /cmd | grep -v /vendor | xargs -n1 -I{} sh -c 'go test -race -covermode=atomic -coverprofile=coverage.tmp -coverpkg $(go list ./... | grep -v /vendor | tr "\n" ",") {} && tail -n +2 coverage.tmp >> coverage.txt || exit 255' && rm coverage.tmp
