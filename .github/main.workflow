workflow "Build and Publish" {
  on = "push"
  resolves = "Publish"
}

action "Lint" {
  uses = "actions/action-builder/shell@master"
  runs = "make"
  args = "lint"
}

action "Test" {
  uses = "actions/action-builder/shell@master"
  runs = "make"
  args = "test"
}

action "Build" {
  needs = ["Lint", "Test"]
  uses = "actions/action-builder/docker@master"
  runs = "make"
  args = "build"
}

## Once we get slower actions, we can publish them to docker hub.
## For that purpose uncomment the following section and add 
## the docker secrets. I'd also suggest creating some kind of pleo-actions
## docker organization since, I think it only supports public repositories.
# action "Publish Filter" {
#   needs = ["Build"]
#   uses = "actions/bin/filter@master"
#   args = "branch master"
# }
#
# action "Docker Login" {
#   needs = ["Publish Filter"]
#   uses = "actions/docker/login@master"
#  secrets = ["DOCKER_USERNAME", "DOCKER_PASSWORD"]
# }
#
# action "Publish" {
#   needs = ["Docker Login"]
#   uses = "actions/action-builder/docker@master"
#   runs = "make"
#   args = "publish"
# }
