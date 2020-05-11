import path from "path";
import fs from "fs";
import ghCore from "@actions/core";
import { LokaliseApi } from "@lokalise/node-api";

const apiKey = ghCore.getInput("api-token");
const projectId = ghCore.getInput("project-id");
const filePath = ghCore.getInput("file-path");
const tag = ghCore.getInput("tag");
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
  tag,
  locales,
}: {
  lokalise: LokaliseApi;
  projectId: string;
  filePath: string;
  tag?: string;
  locales?: string[];
}) {
  const languageCodes =
    locales || (await getLanguageISOCodes(lokalise, projectId));
  const starterPromise = Promise.resolve(null);
  const uploadFile = async (lang: string) => {
    try {
      const filename = filePath.replace(LANG_ISO_PLACEHOLDER, lang);
      const file: Blob = await readLanguageFile(filename);
      const buff = Buffer.from(file);
      await lokalise.files.upload(projectId, {
        data: buff.toString("base64"),
        filename,
        lang_iso: lang,
        tags: [tag],
      });
      console.log("Uploaded language file " + filename);
    } catch (error) {
      console.error(`Error reading language file ${lang}: ${error.message}`);
    }
  };
  await languageCodes.reduce(
    async (p: Promise<void>, lang: string) => p.then(() => uploadFile(lang)),
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
  tag,
  locales: JSON.parse(locales),
})
  .then(() => console.log("Finished"))
  .catch((error: Error) =>
    ghCore.setFailed(error ? error.message : "Unknown error")
  );
