import {GitHub} from '@actions/github'
import * as core from '@actions/core'
import {CompilerOptions} from 'typescript'

import {typecheck} from './compile'
import {getModifiedFiles} from './modified-file'

const token = core.getInput('githubToken', {required: true})
const flags: CompilerOptions = core
  .getInput('flags', {required: false})
  .split(',')
  .reduce((acc: CompilerOptions, current) => {
    acc[current] = true
    return acc
  }, {})

const octokit = new GitHub(token)

async function run() {
  // List modified files
  const modifiedFiles = await getModifiedFiles(octokit)
  console.log(`Modified files: ${JSON.stringify(modifiedFiles)}`)
  modifiedFiles.forEach((file) => console.log(file))

  // List TypeScript errors
  const typeErrors = typecheck(flags)

  // Only report errors on changed files
  const modifiedFilesErrors = typeErrors.filter((error) =>
    modifiedFiles.includes(error.file)
  )

  // Fail if errors are found in modified files
  if (modifiedFilesErrors) {
    console.log(`Errors in  modified files:`)
    modifiedFilesErrors.forEach((file) => console.log(file.message))
    process.exit(1)
  }

  console.log('No error found in modified files.')
  process.exit(0)
}

run().catch((error) => core.setFailed(error.message))
