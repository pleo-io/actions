import * as core from "@actions/core";
import Octokit from "@octokit/rest";
import { App } from "@octokit/app";

const getAuthenticatedOctokit = (previews?: string[]) => {
  const githubAppID = +core.getInput("github_app_id");
  const githubAppInstallationID = +core.getInput("github_app_installation_id");
  const githubAppPrivateKey = core.getInput("github_app_private_key");

  const app = new App({ id: githubAppID, privateKey: githubAppPrivateKey });
  return new Octokit({
    previews,
    async auth() {
      const installationAccessToken = await app.getInstallationAccessToken({
        installationId: githubAppInstallationID
      });
      return `token ${installationAccessToken}`;
    }
  });
};

async function run() {
  const octokit = getAuthenticatedOctokit([
    "ant-man-preview",
    "machine-man-preview"
  ]);
  const ref = core.getInput("deploy_ref") || process.env["GITHUB_REF"] || "";
  const environment = core.getInput("deploy_environment");
  const ownerRepo =
    core.getInput("deploy_repository") ||
    process.env["GITHUB_REPOSITORY"] ||
    "";
  const [owner, repo] = ownerRepo.split("/");

  console.log(
    `Triggering Deploy event on '${owner}/${repo}' @ref:'${ref}' in env '${environment}'`
  );

  await octokit.repos.createDeployment({
    owner,
    repo,
    ref,
    environment,
    required_contexts: []
  });
}

run().catch(error => core.setFailed(error.message));
