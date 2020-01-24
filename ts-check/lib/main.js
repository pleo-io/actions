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
const token = core.getInput("githubToken", { required: true });
const octokit = new github_1.GitHub(token);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const modifiedFiles = yield modified_file_1.getModifiedFiles(octokit);
        console.log(`Modified files: ${JSON.stringify(modifiedFiles)}`);
        compile_1.compile(process.argv[2]);
    });
}
run().catch(error => core.setFailed(error.message));
