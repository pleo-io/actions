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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const githubAppID = +core.getInput("github_app_id");
            const githubAppInstallationID = +core.getInput("github_app_installation_id");
            const githubAppPrivateKey = core.getInput("github_app_private_key");
            const ownerRepo = core.getInput("deploy_repository") ||
                process.env["GITHUB_REPOSITORY"] ||
                "";
            const ref = core.getInput("deploy_ref") || process.env["GITHUB_REF"] || "";
            const env = core.getInput("deploy_environment");
            const app = new app_1.App({ id: githubAppID, privateKey: githubAppPrivateKey });
            const octokit = new rest_1.default({
                auth() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const installationAccessToken = yield app.getInstallationAccessToken({
                            installationId: githubAppInstallationID
                        });
                        return `token ${installationAccessToken}`;
                    });
                }
            });
            const [owner, repo] = ownerRepo.split("/");
            console.log(`Triggering Deploy event on '${owner}/${repo}' @ref:'${ref}' in env '${env}'`);
            const createDeploymentOptions = {
                owner: owner,
                repo: repo,
                ref: ref,
                required_contexts: [],
                environment: env
            };
            yield octokit.repos.createDeployment(createDeploymentOptions);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
