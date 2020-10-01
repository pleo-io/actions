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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ghCore = __importStar(require("@actions/core"));
const node_api_1 = require("@lokalise/node-api");
const apiKey = ghCore.getInput("api-token");
const projectId = ghCore.getInput("project-id");
const filePath = ghCore.getInput("file-path");
const tags = ghCore.getInput("tags");
const locales = ghCore.getInput("locales");
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
function uploadFiles({ lokalise, projectId, filePath, tags, locales, }) {
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
                    tags,
                });
                console.log("Uploaded language file: " + filename);
            }
            catch (error) {
                console.error(`Error reading language file ${lang}: ${error.message}`);
            }
        });
        return yield languageCodes.reduce((p, lang) => __awaiter(this, void 0, void 0, function* () { return p.then(() => uploadFile(lang)); }), starterPromise);
    });
}
uploadFiles({
    lokalise: new node_api_1.LokaliseApi({ apiKey }),
    projectId,
    filePath: path_1.default.join(process.env.GITHUB_WORKSPACE ? process.env.GITHUB_WORKSPACE : "", filePath),
    tags: JSON.parse(tags),
    locales: JSON.parse(locales),
})
    .then(() => {
    ghCore.setOutput("uploaded", "true");
    console.log("Finished");
})
    .catch((error) => ghCore.setFailed(error ? error.message : "Unknown error"));
