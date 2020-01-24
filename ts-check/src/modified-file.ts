import {context, GitHub} from '@actions/github'

import {Commit, FileStatus} from './types'

const FILES: string[] = []
const commits: Commit[] = context.payload.commits.filter(
  (commit: Commit) => commit.distinct
)

const repo = context.payload.repository?.name || ''
const owner = context.payload.repository?.organization

async function processCommit(octokit: GitHub, commit: Commit) {
  const result = await octokit.repos.getCommit({owner, repo, ref: commit.id})

  if (result && result.data) {
    const files = result.data.files

    files.forEach((file) => {
      FileStatus.ADDED === file.status && FILES.push(file.filename)
      FileStatus.MODIFIED === file.status && FILES.push(file.filename)
    })
  }
}

export async function getModifiedFiles(octokit: GitHub) {
  await Promise.all(commits.map((commit) => processCommit(octokit, commit)))
  return FILES
}
