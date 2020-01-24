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
function reportFileErrors(diagnostics) {
    return diagnostics
        .filter((diagnostic) => !!diagnostic.file)
        .map((diagnostic) => { var _a; return ((_a = diagnostic.file) === null || _a === void 0 ? void 0 : _a.fileName) || ''; });
}
function readConfigFile(configFileName) {
    // Read config file
    const configFileText = fs.readFileSync(configFileName).toString();
    // Parse JSON, after removing comments. Just fancier JSON.parse
    const result = ts.parseConfigFileTextToJson(configFileName, configFileText);
    const configObject = result.config;
    if (!configObject) {
        console.error(`Could not find config ${configFileName}`);
        process.exit(1);
    }
    // Extract config infromation
    const configParseResult = ts.parseJsonConfigFileContent(configObject, ts.sys, path.dirname(configFileName));
    if (configParseResult.errors.length > 0) {
        console.error(`Error parsing config ${configFileName}:`, configParseResult.errors);
        process.exit(1);
    }
    return configParseResult;
}
function typecheck(flags) {
    const configFileName = './tsconfig.json';
    let config = readConfigFile(configFileName);
    let program = ts.createProgram(config.fileNames, Object.assign(Object.assign(Object.assign({}, config.options), flags), { noEmit: true }));
    let emitResult = program.emit();
    return reportFileErrors(ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics));
}
exports.typecheck = typecheck;
