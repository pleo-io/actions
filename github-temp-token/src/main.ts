import * as core from "@actions/core";
import { createAppAuth } from "@octokit/auth-app";

async function run() {
  const githubAppID = +core.getInput("github_app_id");
  const githubAppInstallationID = +core.getInput("github_app_installation_id");
  const githubAppPrivateKey = core.getInput("github_app_private_key");

  const auth = createAppAuth({
    appId: githubAppID,
    privateKey: githubAppPrivateKey,
    installationId: githubAppInstallationID,
  });

  const { token } = await auth({ type: "installation" });
  core.setOutput("github_temp_token", token);
}

run().catch((error) => core.setFailed(error.message));
