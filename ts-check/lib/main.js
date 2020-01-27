"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const github_1 = require("@actions/github");
const core = __importStar(require("@actions/core"));
const compile_1 = require("./compile");
const modified_file_1 = require("./modified-file");
const token = core.getInput('githubToken', { required: true });
const flags = core
    .getInput('flags', { required: false })
    .split(',')
    .reduce((acc, current) => {
    acc[current] = true;
    return acc;
}, {});
const octokit = new github_1.GitHub(token);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        // List modified files
        const modifiedFiles = yield modified_file_1.getModifiedFilesTwo(octokit);
        // List TypeScript errors
        const typeErrors = compile_1.typecheck(flags);
        // Only report errors on changed files
        const modifiedFilesErrors = typeErrors.filter((error) => modifiedFiles.includes(error.file));
        // Fail if errors are found in modified files
        if (modifiedFilesErrors.length > 0) {
            let message = 'Errors in  modified files: \n';
            modifiedFilesErrors.forEach((file) => {
                message += file.message + '\n';
            });
            console.log(message);
            process.exit(1);
        }
        console.log('No error found in modified files.');
        process.exit(0);
    });
}
run().catch((error) => core.setFailed(error.message));
