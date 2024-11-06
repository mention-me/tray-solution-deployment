import axios from "axios";
import * as core from "@actions/core";
import { publish } from "@utils/deploy/publish";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock("@actions/core");
const mockedCore = core as jest.Mocked<typeof core>;

describe("Given a solution id to the publish helper", () => {
  it("should successfully publish the solution and return results", async () => {
    mockedCore.getInput.mockImplementationOnce((name: string) => {
      if (name === "apiKey") {
        return "some-api-key";
      }

      throw new Error(`Unexpected input: ${name}`);
    });

    mockedAxios.post.mockResolvedValue({
      status: 201,
      data: {
        releaseId: "1234",
        breakingChanges: true,
        requiresNewUserInput: true,
        requiresNewSystemInput: false,
      },
    });

    const result = await publish("eu1", "mock-solution-id");

    // Should have called for the API key
    expect(mockedCore.getInput).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      releaseId: "1234",
      breakingChanges: true,
      requiresNewUserInput: true,
      requiresNewSystemInput: false,
    });
  });

  it("should handle invalid HTTP responses", async () => {
    mockedCore.getInput.mockImplementationOnce((name: string) => {
      if (name === "apiKey") {
        return "some-api-key";
      }

      throw new Error(`Unexpected input: ${name}`);
    });

    mockedAxios.post.mockResolvedValue({
      status: 500,
      data: "Invalid response",
    });

    await expect(
      async () => await publish("eu1", "mock-solution-id"),
    ).rejects.toThrow(
      'Failed to publish the solution (status code: 500): "Invalid response"',
    );
  });
});
