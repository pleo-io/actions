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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const github_1 = require("@actions/github");
const core_1 = __importDefault(require("@actions/core"));
const types_1 = require("./types");
const gh = new github_1.GitHub(core_1.default.getInput("githubToken"));
const FILES = [];
const commits = github_1.context.payload.commits.filter((commit) => commit.distinct);
const repo = ((_a = github_1.context.payload.repository) === null || _a === void 0 ? void 0 : _a.name) || "";
const owner = (_b = github_1.context.payload.repository) === null || _b === void 0 ? void 0 : _b.organization;
function processCommit(commit) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield gh.repos.getCommit({ owner, repo, ref: commit.id });
        if (result && result.data) {
            const files = result.data.files;
            files.forEach(file => {
                types_1.FileStatus.ADDED === file.status && FILES.push(file.filename);
                types_1.FileStatus.MODIFIED === file.status && FILES.push(file.filename);
            });
        }
    });
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        Promise.all(commits.map(processCommit)).then(() => {
            console.log(`All files: ${JSON.stringify(FILES)}`);
        });
    });
}
run().catch(error => core_1.default.setFailed(error.message));
