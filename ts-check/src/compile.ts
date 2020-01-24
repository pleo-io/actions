import * as ts from 'typescript'
import * as fs from 'fs'
import * as path from 'path'

function reportFileErrors(diagnostics: ts.Diagnostic[]): string[] {
  return diagnostics
    .filter((diagnostic) => !!diagnostic.file)
    .map((diagnostic) => diagnostic.file?.fileName || '')
}

function readConfigFile(configFileName: string) {
  // Read config file
  const configFileText = fs.readFileSync(configFileName).toString()

  // Parse JSON, after removing comments. Just fancier JSON.parse
  const result = ts.parseConfigFileTextToJson(configFileName, configFileText)
  const configObject = result.config

  if (!configObject) {
    console.error(`Could not find config ${configFileName}`)
    process.exit(1)
  }

  // Extract config infromation
  const configParseResult = ts.parseJsonConfigFileContent(
    configObject,
    ts.sys,
    path.dirname(configFileName)
  )

  if (configParseResult.errors.length > 0) {
    console.error(
      `Error parsing config ${configFileName}:`,
      configParseResult.errors
    )
    process.exit(1)
  }

  return configParseResult
}

export function typecheck(flags: ts.CompilerOptions): string[] {
  const configFileName = './tsconfig.json'
  let config = readConfigFile(configFileName)

  console.log('FLAGS', JSON.stringify(flags, null, 2))
  let program = ts.createProgram(config.fileNames, {
    ...config.options,
    ...flags,
    noEmit: true
  })

  let emitResult = program.emit()

  return reportFileErrors(
    ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
  )
}
