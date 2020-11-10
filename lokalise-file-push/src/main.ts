import path from "path";
import fs from "fs";
import * as ghCore from "@actions/core";
import { LokaliseApi } from "@lokalise/node-api";

const apiKey = ghCore.getInput("api-token");
const projectId = ghCore.getInput("project-id");
const filePath = ghCore.getInput("file-path");
const tags = ghCore.getInput("tags");
const locales = ghCore.getInput("locales");

const LANG_ISO_PLACEHOLDER = "%LANG_ISO%";

async function getLanguageISOCodes(lokalise: LokaliseApi, projectId: string) {
  const languages = await lokalise.languages.list({
    project_id: projectId,
  });
  return languages.map((x) => x.lang_iso);
}

function readLanguageFile(path: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, data: any) => {
      if (err) {
        reject(err);
        return;
      }
      console.log("Read language file " + path);
      resolve(data);
    });
  });
}

async function uploadFiles({
  lokalise,
  projectId,
  filePath,
  tags,
  locales,
  callback,
}: {
  lokalise: LokaliseApi;
  projectId: string;
  filePath: string;
  tags: string[];
  locales?: string[];
  callback: Function;
}) {
  const languageCodes =
    locales || (await getLanguageISOCodes(lokalise, projectId));
  const starterPromise = Promise.resolve(null);
  const uploadFile = async (lang: string, callback: Function) => {
    try {
      const filename = filePath.replace(LANG_ISO_PLACEHOLDER, lang);
      const file: Blob = await readLanguageFile(filename);
      const buff = Buffer.from(file);
      let process = await lokalise.files.upload(projectId, {
        data: buff.toString("base64"),
        filename,
        lang_iso: lang,
        tags,
        //@ts-ignore
        convert_placeholders: false,
      });

      let inteval = await setInterval(async () => {
        if (process.status === "finished") {
          clearInterval(inteval);
          console.log("Uploaded language file: " + filename);
          callback();
        } else {
          //@ts-ignore
          process = await lokalise.queuedProcesses.get(process.process_id, {
            project_id: projectId,
          });
        }
      }, 1000);
    } catch (error) {
      ghCore.setFailed(error ? error.message : "Unknown error");
    }
  };
  await languageCodes.reduce(
    async (p: Promise<void>, lang: string) =>
      p.then(() => uploadFile(lang, callback)),
    starterPromise
  );
}

uploadFiles({
  lokalise: new LokaliseApi({ apiKey }),
  projectId,
  filePath: path.join(
    process.env.GITHUB_WORKSPACE ? process.env.GITHUB_WORKSPACE : "",
    filePath
  ),
  tags: JSON.parse(tags),
  locales: JSON.parse(locales),
  callback: () => {
    console.log("Finished");
  },
});
