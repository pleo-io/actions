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
const node_api_1 = require("@lokalise/node-api");
const ghCore = __importStar(require("@actions/core"));
const helpers_1 = require("./helpers");
const apiKey = ghCore.getInput("api-token");
const projectId = ghCore.getInput("project-id");
const keyTags = ghCore.getInput("tags");
const teamName = ghCore.getInput("team-name");
const assigneeEmailList = ghCore.getInput("assignee-email-list");
const taskTitle = ghCore.getInput("task-title");
const taskDescription = ghCore.getInput("task-description");
const taskOptions = ghCore.getInput("task-options");
function getKeys(lokalise) {
    return __awaiter(this, void 0, void 0, function* () {
        const keys = yield lokalise.keys.list({
            project_id: projectId,
            filter_tags: JSON.parse(keyTags).join(),
        });
        if (keys && keys.length > 0) {
            return keys.map((x) => x.key_id);
        }
        return null;
    });
}
function getAssigneeIdObject(lokalise) {
    return __awaiter(this, void 0, void 0, function* () {
        const teams = yield lokalise.teams.list();
        const team = teams.find(({ name }) => name === teamName);
        if (team) {
            const teamUsers = yield lokalise.teamUsers.list({ team_id: team.team_id });
            const assigneeEmailListParsed = JSON.parse(assigneeEmailList);
            const assigneeIdObject = {};
            Object.keys(assigneeEmailListParsed).map(function (key) {
                const assigneeEmailListPerLanguage = assigneeEmailListParsed[key];
                const assigneeList = teamUsers.filter(({ email }) => assigneeEmailListPerLanguage.includes(email));
                if (assigneeList && assigneeList.length > 0) {
                    assigneeIdObject[key] = assigneeList.map(({ user_id }) => user_id);
                }
            });
            return assigneeIdObject;
        }
        return null;
    });
}
const createTask = (lokalise, language, keys, assigneeIdList) => __awaiter(void 0, void 0, void 0, function* () {
    const options = JSON.parse(taskOptions);
    yield lokalise.tasks.create(Object.assign({ title: taskTitle, description: helpers_1.getTaskDescription(taskDescription), languages: [
            {
                language_iso: language,
                users: assigneeIdList,
            },
        ], keys }, options), {
        project_id: projectId,
    });
});
function createTasksPerLanguage(lokalise, keys, assigneeIdObject) {
    return __awaiter(this, void 0, void 0, function* () {
        const languageCodes = Object.keys(assigneeIdObject);
        const starterPromise = Promise.resolve(null);
        yield languageCodes.reduce((p, language) => __awaiter(this, void 0, void 0, function* () {
            return p.then(() => createTask(lokalise, language, keys, assigneeIdObject[language]));
        }), starterPromise);
    });
}
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lokalise = new node_api_1.LokaliseApi({
            apiKey,
        });
        const keys = yield getKeys(lokalise);
        if (!keys) {
            throw new Error(`No keys found by '${keyTags}' tags`);
        }
        const assigneeIdObject = yield getAssigneeIdObject(lokalise);
        if (!assigneeIdObject || Object.keys(assigneeIdObject).length === 0) {
            throw new Error(`No users inside ${teamName} team with ${assigneeEmailList}`);
        }
        yield createTasksPerLanguage(lokalise, keys, assigneeIdObject);
    }
    catch (e) {
        console.log(e);
    }
});
start()
    .then(() => console.log("Finished"))
    .catch((error) => ghCore.setFailed(error ? error.message : "Unknown error"));
