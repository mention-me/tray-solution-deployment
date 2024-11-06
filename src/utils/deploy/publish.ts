import * as core from "@actions/core";
import { getApiBaseUrl } from "@utils/getApiBaseUrl";
import axios from "axios";
import { Publish } from "@utils/deploy/types";

export const publish = async (
  region: Parameters<typeof getApiBaseUrl>[0],
  solutionId: string,
): Promise<Publish> => {
  const apiKey = core.getInput("apiKey", { required: true });
  const baseUrl = getApiBaseUrl(region);

  const response = await axios.post(
    `${baseUrl}/core/v1/solutions/${solutionId}/releases`,
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

  if (response.status !== 201) {
    throw new Error(
      `Failed to publish the solution (status code: ${response.status}): ${JSON.stringify(response.data)}`,
    );
  }

  const data = response.data;

  if (
    data?.releaseId === undefined ||
    data?.breakingChanges === undefined ||
    data?.requiresNewUserInput === undefined ||
    data?.requiresNewSystemInput === undefined
  ) {
    throw new Error(
      `Failed to parse the response from publishing the preview: ${JSON.stringify(response.data)}`,
    );
  }

  return {
    releaseId: data.releaseId,
    breakingChanges: data.breakingChanges,
    requiresNewUserInput: data.requiresNewUserInput,
    requiresNewSystemInput: data.requiresNewSystemInput,
  };
};
