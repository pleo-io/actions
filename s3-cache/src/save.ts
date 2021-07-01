import * as core from "@actions/core"
import {CacheTempFileName, Inputs, Outputs} from './constants'
import * as utils from "./utils"
import path from 'path'
import * as exec from '@actions/exec'
import {S3} from 'aws-sdk'
import fs from 'fs'

async function run() {
    const cacheHit = core.getState(Outputs.CacheHit)
    const bucket = core.getState(Inputs.Bucket)
    const key = core.getState(Inputs.Key)

    core.debug(`${Outputs.CacheHit}: ${cacheHit}`)

    if (cacheHit) {
        core.info('Cache hit occurred, not saving cache.')
        return
    }

    const archiveFolder = await utils.createTempDirectory()
    const archivePath = path.join(archiveFolder, CacheTempFileName)
    core.debug(`Archiving to path: ${archivePath}`)

    const cachePaths = utils.getInputAsArray(Inputs.Path, {required: true})

    try {
        await exec.exec(`tar -zcf ${archivePath} ${cachePaths.join(' ')}`)
    } catch (error) {
        throw new Error(`Tar failed: ${error?.message}`)
    }

    const s3 = new S3()
    const param: S3.Types.PutObjectRequest = {
        Bucket: bucket,
        Key: key,
        Body: fs.readFileSync(archivePath)
    }
    try {
        await s3.putObject(param).promise()
        core.info('Cache saved successfully')
    } catch (error) {
        core.warning(`Failed upload cache to S3: ${error.message}`)
    }
}

run().catch((err) => {
    core.setFailed(err.toString())
})
