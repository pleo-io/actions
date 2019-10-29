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
const github_1 = __importDefault(require("@actions/github"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const octokit = new github_1.default.GitHub(core.getInput("githubToken"), {
            previews: ["flash-preview", "ant-man-preview", "machine-man-preview"]
        });
        const deploymentId = +core.getInput("deploymentId");
        const deploymentState = core.getInput("deploymentState");
        const ownerRepo = core.getInput("repository") || process.env["GITHUB_REPOSITORY"] || "";
        const [owner, repo] = ownerRepo.split("/");
        console.log(`Sending state ${deploymentState} of deployment ${deploymentId} of ${owner}/${repo}`);
        octokit.repos.createDeploymentStatus({
            owner,
            repo,
            deployment_id: deploymentId,
            state: deploymentState,
            description: core.getInput("deploymentDescription"),
            environment: core.getInput("deploymentEnvironment"),
            environment_url: core.getInput("deploymentEnvironmentUrl"),
            auto_inactive: true
        });
    });
}
run().catch(error => core.setFailed(error.message));
