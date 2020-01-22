"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const rest_1 = __importDefault(require("@octokit/rest"));
const app_1 = require("@octokit/app");
const getAuthenticatedOctokit = (previews) => {
    const githubAppID = +core.getInput("github_app_id");
    const githubAppInstallationID = +core.getInput("github_app_installation_id");
    const githubAppPrivateKey = core.getInput("github_app_private_key");
    const app = new app_1.App({ id: githubAppID, privateKey: githubAppPrivateKey });
    return new rest_1.default({
        previews,
        auth() {
            return __awaiter(this, void 0, void 0, function* () {
                const installationAccessToken = yield app.getInstallationAccessToken({
                    installationId: githubAppInstallationID
                });
                return `token ${installationAccessToken}`;
            });
        }
    });
};
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const octokit = getAuthenticatedOctokit([
            "ant-man-preview",
            "machine-man-preview"
        ]);
        const ref = core.getInput("deploy_ref") || process.env["GITHUB_REF"] || "";
        const environment = core.getInput("deploy_environment");
        const ownerRepo = core.getInput("deploy_repository") ||
            process.env["GITHUB_REPOSITORY"] ||
            "";
        const [owner, repo] = ownerRepo.split("/");
        const autoMerge = core.getInput("auto_merge") !== "false";
        console.log(`Triggering Deploy event on '${owner}/${repo}' @ref:'${ref}' in env '${environment}'`);
        yield octokit.repos.createDeployment({
            owner,
            repo,
            ref,
            environment,
            required_contexts: [],
            auto_merge: autoMerge
        });
    });
}
run().catch(error => core.setFailed(error.message));
