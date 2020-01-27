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
Object.defineProperty(exports, "__esModule", { value: true });
const github_1 = require("@actions/github");
const types_1 = require("./types");
function processModifiedFiles(files) {
    return __awaiter(this, void 0, void 0, function* () {
        return files.reduce((acc, f) => {
            if (f.status === types_1.FileStatus.ADDED || f.status === types_1.FileStatus.MODIFIED) {
                acc.push(f.filename);
            }
            return acc;
        }, []);
    });
}
function getModifiedFilesTwo(octokit) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = octokit.pulls.listFiles.endpoint.merge({
            owner: github_1.context.repo.owner,
            repo: github_1.context.repo.repo,
            pull_number: github_1.context.payload.pull_request
        });
        return processModifiedFiles(yield octokit.paginate(options).then((files) => {
            return files;
        }));
    });
}
exports.getModifiedFilesTwo = getModifiedFilesTwo;
