const path = require("path");
const fs = require("fs");

const LANG_ISO_PLACEHOLDER = "%LANG_ISO%";

async function getLanguageISOCodes(lokalise, projectId) {
  const languages = await lokalise.languages.list({
    project_id: projectId,
  });
  return languages.map((x) => x.lang_iso);
}

function readLanguageFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf-8", (err, data) => {
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
  languageCodes,
  projectId,
  filePath,
  tag,
}) {
  const starterPromise = Promise.resolve(null);
  const uploadFile = async (lang) => {
    try {
      const filename = filePath.replace(LANG_ISO_PLACEHOLDER, lang);
      const file = await readLanguageFile(filename);
      const buff = Buffer.from(file);
      const data = await lokalise.files.upload(projectId, {
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
    async (p, lang) => p.then(() => uploadFile(lang)),
    starterPromise
  );
}

module.exports = async ({ lokalise, projectId, filePath, tag, locales }) => {
  const languageCodes =
    locales || (await getLanguageISOCodes(lokalise, projectId));

  await uploadFiles({
    lokalise,
    languageCodes,
    projectId,
    filePath,
    tag,
  });
};
