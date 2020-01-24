import { context, GitHub } from "@actions/github";
import core from "@actions/core";

import { Commit, FileStatus } from "./types";

const gh = new GitHub(core.getInput("githubToken"));

const FILES: string[] = [];
const commits: Commit[] = context.payload.commits.filter(
  (commit: Commit) => commit.distinct
);

const repo = context.payload.repository?.name || "";
const owner = context.payload.repository?.organization;

async function processCommit(commit: Commit) {
  const result = await gh.repos.getCommit({ owner, repo, ref: commit.id });

  if (result && result.data) {
    const files = result.data.files;

    files.forEach(file => {
      FileStatus.ADDED === file.status && FILES.push(file.filename);
      FileStatus.MODIFIED === file.status && FILES.push(file.filename);
    });
  }
}

async function run() {
  Promise.all(commits.map(processCommit)).then(() => {
    console.log(`All files: ${JSON.stringify(FILES)}`);
  });
}

run().catch(error => core.setFailed(error.message));
