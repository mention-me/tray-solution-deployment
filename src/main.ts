import * as core from "@actions/core";
import { getRegion } from "@utils/getRegion";
import { getSolutionId } from "@utils/build/getSolutionId";
import { preview } from "@utils/deploy/preview";
import { publish } from "@utils/deploy/publish";

/**
 * Preview and deploy solutions in Tray.ai.
 *
 * The process is as follows:
 * 1. Parse the solution id from the project export file (if provided - otherwise the solution id
 *    is must be passed).
 * 2. If only previewing, just retrieve the solution information from Tray.ai.
 * 3. If publishing a solution, actually publish the solution and retrieve the solution information after.
 */
export async function run(): Promise<void> {
  try {
    const region = getRegion(core.getInput("region", { required: true }));
    const shouldPublish =
      core.getInput("shouldPublish", { required: false }) ?? "false";

    const solutionId = getSolutionId();
    core.setOutput("solutionId", solutionId);

    let result;
    if (shouldPublish === "true") {
      result = await publish(region, solutionId);
      core.setOutput("releaseId", result.releaseId);
    } else {
      result = await preview(region, solutionId);
    }

    console.log(result);

    core.setOutput("breakingChanges", result.breakingChanges);
    core.setOutput("requiresNewUserInput", result.requiresNewUserInput);
    core.setOutput("requiresNewSystemInput", result.requiresNewSystemInput);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}
