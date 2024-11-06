import * as fs from "fs";
import * as core from "@actions/core";

export type Project = {
  solution: {
    id: string;
  };
};

/**
 * Parse a project JSON file at the given path.
 *
 * If none is provided, it will look for the file in the current working directory.
 */
export function parse(projectFile: string): Project {
  if (!fs.existsSync(projectFile)) {
    throw new Error(`Project file not found at path: ${projectFile}`);
  }

  let json;
  try {
    json = JSON.parse(fs.readFileSync(projectFile, "utf8"));
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error(
        `Error while parsing the "${projectFile}" file: ${e.message}`,
      );
    }

    throw new Error(`An unknown error occurred while reading "${projectFile}"`);
  }

  if (!json?.solution?.id) {
    throw new Error(
      `The project JSON file does not have a solution ID`,
    );
  }

  core.info(`Project file has been parsed successfully. ID: ${json.id}`);

  return {
    solution: {
      id: json?.solution?.id,
    },
  };
}
