import { LokaliseApi } from "@lokalise/node-api";
import * as ghCore from "@actions/core";
import { getTaskDescription } from "./helpers";

const apiKey = ghCore.getInput("api-token");
const projectId = ghCore.getInput("project-id");
const keyTags = ghCore.getInput("tags");
const teamName = ghCore.getInput("team-name");
const assigneeEmailList = ghCore.getInput("assignee-email-list");
const taskTitle = ghCore.getInput("task-title");
const taskDescription = ghCore.getInput("task-description");
const taskOptions = ghCore.getInput("task-options");

async function getKeys(lokalise: LokaliseApi) {
  const keys = await lokalise.keys.list({
    project_id: projectId,
    filter_tags: JSON.parse(keyTags).join(),
  });
  if (keys && keys.length > 0) {
    return keys.map((x) => x.key_id);
  }
  return null;
}

async function getAssigneeIdObject(lokalise: LokaliseApi) {
  const teams = await lokalise.teams.list();
  const team = teams.find(({ name }) => name === teamName);
  if (team) {
    const teamUsers = await lokalise.teamUsers.list({ team_id: team.team_id });
    const assigneeEmailListParsed = JSON.parse(assigneeEmailList);

    const assigneeIdObject = {} as any;
    Object.keys(assigneeEmailListParsed).map(function (key: string) {
      const assigneeEmailListPerLanguage = assigneeEmailListParsed[key];

      const assigneeList = teamUsers.filter(({ email }) =>
        assigneeEmailListPerLanguage.includes(email)
      );

      if (assigneeList && assigneeList.length > 0) {
        assigneeIdObject[key] = assigneeList.map(({ user_id }) => user_id);
      }
    });
    return assigneeIdObject;
  }
  return null;
}

const createTask = async (
  lokalise: LokaliseApi,
  language: string,
  keys: number[],
  assigneeIdList: number[]
) => {
  const options = JSON.parse(taskOptions);
  await lokalise.tasks.create(
    {
      title: taskTitle,
      description: getTaskDescription(taskDescription),
      languages: [
        {
          language_iso: language,
          users: assigneeIdList,
        },
      ],
      keys,
      ...options,
    },
    {
      project_id: projectId,
    }
  );
};

async function createTasksPerLanguage(
  lokalise: LokaliseApi,
  keys: number[],
  assigneeIdObject: { [key: string]: number[] }
) {
  const languageCodes: string[] = Object.keys(assigneeIdObject);

  const starterPromise = Promise.resolve(null);

  await languageCodes.reduce<any>(
    async (p: Promise<void>, language: string) =>
      p.then(() =>
        createTask(lokalise, language, keys, assigneeIdObject[language])
      ),
    starterPromise
  );
}

const start = async () => {
  try {
    const lokalise = new LokaliseApi({
      apiKey,
    });

    const keys = await getKeys(lokalise);
    if (!keys) {
      throw new Error(`No keys found by '${keyTags}' tags`);
    }

    const assigneeIdObject = await getAssigneeIdObject(lokalise);
    if (!assigneeIdObject || Object.keys(assigneeIdObject).length === 0) {
      throw new Error(
        `No users inside ${teamName} team with ${assigneeEmailList}`
      );
    }

    await createTasksPerLanguage(lokalise, keys, assigneeIdObject);
  } catch (e) {
    console.log(e);
  }
};

start()
  .then(() => console.log("Finished"))
  .catch((error: Error) =>
    ghCore.setFailed(error ? error.message : "Unknown error")
  );
