import * as io from '@actions/io'
import * as path from 'path'
import {v4 as uuidv4} from 'uuid'
import * as core from "@actions/core";

// from actions/cache
export async function createTempDirectory(): Promise<string> {
    const IS_WINDOWS = process.platform === 'win32'

    let tempDirectory: string = process.env['RUNNER_TEMP'] || ''

    if (!tempDirectory) {
        let baseLocation: string
        if (IS_WINDOWS) {
            // On Windows use the USERPROFILE env variable
            baseLocation = process.env['USERPROFILE'] || 'C:\\'
        } else {
            if (process.platform === 'darwin') {
                baseLocation = '/Users'
            } else {
                baseLocation = '/home'
            }
        }
        tempDirectory = path.join(baseLocation, 'actions', 'temp')
    }

    const dest = path.join(tempDirectory, uuidv4())
    await io.mkdirP(dest)
    return dest
}

export function getInputAsArray(
    name: string,
    options?: core.InputOptions
): string[] {
    return core
        .getInput(name, options)
        .split("\n")
        .map(s => s.trim())
        .filter(x => x !== "");
}
