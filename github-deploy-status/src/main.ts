import * as core from "@actions/core";
import github from "@actions/github";
import { ReposCreateDeploymentStatusParams } from "@octokit/rest";

async function run() {
  const octokit = new github.GitHub(core.getInput("githubToken"), {
    previews: ["flash-preview", "ant-man-preview", "machine-man-preview"]
  });
  const deploymentId = +core.getInput("deploymentId");
  const deploymentState = core.getInput(
    "deploymentState"
  ) as ReposCreateDeploymentStatusParams["state"];
  const ownerRepo =
    core.getInput("repository") || process.env["GITHUB_REPOSITORY"] || "";
  const [owner, repo] = ownerRepo.split("/");

  console.log(
    `Sending state ${deploymentState} of deployment ${deploymentId} of ${owner}/${repo}`
  );

  octokit.repos.createDeploymentStatus({
    owner,
    repo,
    deployment_id: deploymentId,
    state: deploymentState,
    description: core.getInput("deploymentDescription"),
    environment: core.getInput("deploymentEnvironment") as any,
    environment_url: core.getInput("deploymentEnvironmentUrl"),
    auto_inactive: true
  });
}

run().catch(error => core.setFailed(error.message));
