import * as core from "@actions/core";
import { parse } from "@utils/build/parse";

/**
 * Get the solution ID which should be deployed (or previewed)
 */
export const getSolutionId = (): string => {
  const solutionId = core.getInput("solutionId", { required: false });

  if (solutionId) {
    // Return the solution id if it was provided.
    return solutionId;
  }

  const path = core.getInput("path", { required: false });

  if (!path) {
    throw new Error(
      "Either the solution id or the path to the project file must be provided",
    );
  }

  const {
    solution: { id },
  } = parse(path);

  return id;
};
