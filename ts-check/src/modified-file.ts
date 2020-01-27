import {context, GitHub} from '@actions/github'
import {ReposGetCommitResponseFilesItem} from '@octokit/rest'

import {FileStatus} from './types'

async function processModifiedFiles(
  files: ReposGetCommitResponseFilesItem[]
): Promise<string[]> {
  return files.reduce((acc: string[], f) => {
    if (f.status === FileStatus.ADDED || f.status === FileStatus.MODIFIED) {
      acc.push(f.filename)
    }
    return acc
  }, [])
}

export async function getModifiedFiles(octokit: GitHub): Promise<string[]> {
  const options = octokit.pulls.listFiles.endpoint.merge({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.payload.pull_request
  })
  return processModifiedFiles(
    await octokit.paginate(options).then((files) => {
      return files
    })
  )
}
