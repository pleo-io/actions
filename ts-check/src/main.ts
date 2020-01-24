import { GitHub } from "@actions/github";
import * as core from "@actions/core";

import { getModifiedFiles } from "./modified-file";

const token = core.getInput("githubToken", { required: true });
const octokit = new GitHub(token);

async function run() {
  const modifiedFiles = await getModifiedFiles(octokit);
  console.log(`Modified files: ${JSON.stringify(modifiedFiles)}`);
}

run().catch(error => core.setFailed(error.message));
