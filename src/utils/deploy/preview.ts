import * as core from "@actions/core";
import { getApiBaseUrl } from "@utils/getApiBaseUrl";
import axios from "axios";
import { Preview } from "@utils/deploy/types";

export const preview = async (
  region: Parameters<typeof getApiBaseUrl>[0],
  solutionId: string,
): Promise<Preview> => {
  const apiKey = core.getInput("apiKey", { required: true });
  const baseUrl = getApiBaseUrl(region);

  const response = await axios.post(
    `${baseUrl}/core/v1/solutions/${solutionId}/releases/previews`,
    "",
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },

      // We want to handle all of the possible response statuses, so that we can throw them with our
      // own error message.
      validateStatus: () => true,
    },
  );

  if (response.status !== 200) {
    throw new Error(
      `Failed to preview the solution (status code: ${response.status}): ${JSON.stringify(response.data)}`,
    );
  }

  const data = response.data;

  if (
    data?.breakingChanges === undefined ||
    data?.requiresNewUserInput === undefined ||
    data?.requiresNewSystemInput === undefined
  ) {
    throw new Error(
      `Failed to preview the solution: ${JSON.stringify(response.data)}`,
    );
  }

  return {
    breakingChanges: data.breakingChanges,
    requiresNewUserInput: data.requiresNewUserInput,
    requiresNewSystemInput: data.requiresNewSystemInput,
  };
};
