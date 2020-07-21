import * as core from "@actions/core";
import { App } from "@octokit/app";

const getToken = (previews?: string[]) => {
  const githubAppID = +core.getInput("github_app_id");
  const githubAppInstallationID = +core.getInput("github_app_installation_id");
  const githubAppPrivateKey = core.getInput("github_app_private_key");

  const app = new App({ id: githubAppID, privateKey: githubAppPrivateKey });
  const installationAccessToken = await app.getInstallationAccessToken({
    installationId: githubAppInstallationID
  });
  return `token ${installationAccessToken}`;
};

async function run() {
  const token = getToken([
    "ant-man-preview",
    "machine-man-preview"
  ]);
  core.setOutput('github_temp_token', token)
}

run().catch(error => core.setFailed(error.message));
