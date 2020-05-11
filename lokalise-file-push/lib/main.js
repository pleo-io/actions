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
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const core_1 = __importDefault(require("@actions/core"));
const node_api_1 = require("@lokalise/node-api");
const apiKey = core_1.default.getInput("api-token");
const projectId = core_1.default.getInput("project-id");
const filePath = core_1.default.getInput("file-path");
const tag = core_1.default.getInput("tag");
const locales = core_1.default.getInput("locales");
const LANG_ISO_PLACEHOLDER = "%LANG_ISO%";
function getLanguageISOCodes(lokalise, projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const languages = yield lokalise.languages.list({
            project_id: projectId,
        });
        return languages.map((x) => x.lang_iso);
    });
}
function readLanguageFile(path) {
    return new Promise((resolve, reject) => {
        fs_1.default.readFile(path, "utf-8", (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            console.log("Read language file " + path);
            resolve(data);
        });
    });
}
function uploadFiles({ lokalise, projectId, filePath, tag, locales, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const languageCodes = locales || (yield getLanguageISOCodes(lokalise, projectId));
        const starterPromise = Promise.resolve(null);
        const uploadFile = (lang) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filename = filePath.replace(LANG_ISO_PLACEHOLDER, lang);
                const file = yield readLanguageFile(filename);
                const buff = Buffer.from(file);
                yield lokalise.files.upload(projectId, {
                    data: buff.toString("base64"),
                    filename,
                    lang_iso: lang,
                    tags: [tag],
                });
                console.log("Uploaded language file " + filename);
            }
            catch (error) {
                console.error(`Error reading language file ${lang}: ${error.message}`);
            }
        });
        yield languageCodes.reduce((p, lang) => __awaiter(this, void 0, void 0, function* () { return p.then(() => uploadFile(lang)); }), starterPromise);
    });
}
uploadFiles({
    lokalise: new node_api_1.LokaliseApi({ apiKey }),
    projectId,
    filePath: path_1.default.join(process.env.GITHUB_WORKSPACE ? process.env.GITHUB_WORKSPACE : "", filePath),
    tag,
    locales: JSON.parse(locales),
})
    .then(() => console.log("Finished"))
    .catch((error) => core_1.default.setFailed(error ? error.message : "Unknown error"));
