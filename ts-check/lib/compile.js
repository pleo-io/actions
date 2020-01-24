"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts = __importStar(require("typescript"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function reportDiagnostics(diagnostics) {
    diagnostics.forEach(diagnostic => {
        let message = "Error";
        if (diagnostic.file) {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start || 0);
            message += ` ${diagnostic.file.fileName} (${line + 1},${character + 1})`;
        }
        message +=
            ": " + ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
        console.log(message);
    });
}
function readConfigFile(configFileName) {
    // Read config file
    const configFileText = fs.readFileSync(configFileName).toString();
    // Parse JSON, after removing comments. Just fancier JSON.parse
    const result = ts.parseConfigFileTextToJson(configFileName, configFileText);
    const configObject = result.config;
    if (!configObject) {
        reportDiagnostics(result.error ? [result.error] : []);
        process.exit(1);
    }
    // Extract config infromation
    const configParseResult = ts.parseJsonConfigFileContent(configObject, ts.sys, path.dirname(configFileName));
    if (configParseResult.errors.length > 0) {
        reportDiagnostics(configParseResult.errors);
        process.exit(1);
    }
    return configParseResult;
}
function compile(configFileName) {
    // Extract configuration from config file
    let config = readConfigFile(configFileName);
    // Compile
    let program = ts.createProgram(config.fileNames, Object.assign(Object.assign({}, config.options), { noImplicitAny: true }));
    let emitResult = program.emit();
    // Report errors
    reportDiagnostics(ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics));
    // Return code
    let exitCode = emitResult.emitSkipped ? 1 : 0;
    process.exit(exitCode);
}
exports.compile = compile;
// compile(process.argv[2]);
