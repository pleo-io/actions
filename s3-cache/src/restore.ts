import * as core from "@actions/core"
import {CacheTempFileName, Inputs, Outputs} from './constants'
import * as utils from "./utils"
import {S3} from 'aws-sdk'
import * as path from 'path'
import * as fs from 'fs'
import * as exec from '@actions/exec'

async function run() {
    const s3 = new S3()
    const bucket = core.getInput(Inputs.Bucket, {required: true})
    const key = core.getInput(Inputs.Key, {required: true})

    try {
        const res = await s3.getObject({
            Bucket: bucket,
            Key: key
        }).promise()
        core.info(`Cache found for key: ${key}`)

        const archivePath = path.join(
            await utils.createTempDirectory(),
            CacheTempFileName
        )

        res.Body && fs.writeFileSync(archivePath, res.Body as Buffer)

        try {
            await exec.exec(`tar -zxf ${archivePath}`)
        } catch (error) {
            throw new Error(`Tar failed: ${error?.message}`)
        } finally {
            fs.unlinkSync(archivePath)
        }

        core.info(`Cache restored from key: ${key}`);
        core.setOutput(Outputs.CacheHit, true.toString())
        core.saveState(Outputs.CacheHit, true.toString())
    } catch (error) {
        core.info(`Cache not found for key: ${key}`)
        core.setOutput(Outputs.CacheHit, false.toString())
        core.saveState(Outputs.CacheHit, false.toString())
    } finally {
        core.saveState(Inputs.Key, key)
        core.saveState(Inputs.Bucket, bucket)
    }
}

run().catch((err) => {
    core.setFailed(err.toString())
})
