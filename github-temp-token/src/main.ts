import * as core from "@actions/core";
import { App } from "@octokit/app";

async function run() {
  const githubAppID = +core.getInput("github_app_id");
  const githubAppInstallationID = +core.getInput("github_app_installation_id");
  const githubAppPrivateKey = core.getInput("github_app_private_key");

  const app = new App({ id: githubAppID, privateKey: githubAppPrivateKey });
  const token = await app.getInstallationAccessToken({
    installationId: githubAppInstallationID
  });
  core.setOutput('github_temp_token', token)
}

run().catch(error => core.setFailed(error.message));
