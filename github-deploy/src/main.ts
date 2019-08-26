import * as core from '@actions/core'
import * as jwt from 'jsonwebtoken'
import Octokit from '@octokit/rest'

const previews = [
  'ant-man-preview',
  'machine-man-preview'
]

async function run() {
  try {
    const githubAppID = core.getInput('github_app_id')
    const githubAppInstallationID = core.getInput('github_app_installation_id')
    const githubAppPrivateKey = core.getInput('github_app_private_key')

    const ownerRepo = core.getInput('deploy_repository') || process.env['GITHUB_REPOSITORY'] || ''
    const ref = core.getInput('deploy_ref') || process.env['GITHUB_REF'] || ''
    const env = core.getInput('deploy_environment')

    const now = Math.floor(Date.now() /1000)
    var appToken = jwt.sign({
        iat: now,
        exp:  now + (10 * 60),
        iss: githubAppID
      }, githubAppPrivateKey, { algorithm: 'RS256'})

    const octokitForApp = new Octokit({
      auth: appToken,
      previews
    })

    const token = await octokitForApp.apps.createInstallationToken({
      installation_id: Number.parseInt(githubAppInstallationID)
    })
    
    const octokitForDeployment = new Octokit({
      auth: token.data.token,
      previews
    })

    const [owner,repo] = ownerRepo.split('/')

    console.log(`Triggering Deploy event on '${owner}/${repo}' @ref:'${ref}' in env '${env}'`)

    const createDeploymentOptions: Octokit.ReposCreateDeploymentParams = {
      owner: owner,
      repo: repo,
      ref: ref,
      required_contexts: [],
      environment: env
    }

    await octokitForDeployment.repos.createDeployment(createDeploymentOptions)
  } catch (error) {
    core.setFailed(error.message);
  }
}
  
run();