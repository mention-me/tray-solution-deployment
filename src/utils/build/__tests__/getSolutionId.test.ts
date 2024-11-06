import * as core from "@actions/core";
import { getSolutionId } from "../getSolutionId";

jest.mock("@actions/core");
const mockedCore = core as jest.Mocked<typeof core>;

describe("Given the solution id helper", () => {
  it("should handle parsing a valid project file", () => {
    mockedCore.getInput.mockImplementation((name: string) => {
      if (name === "path") {
        return "src/utils/__mocks__/valid/valid-project.json";
      } else if (name === "solutionId") {
        return "";
      }

      throw new Error(`Unexpected input: ${name}`);
    });

    expect(getSolutionId()).toEqual("999");
  });

  it("should handle being given a solution id as an input directly", () => {
    mockedCore.getInput.mockImplementationOnce((name: string) => {
      if (name === "path") {
        return "";
      } else if (name === "solutionId") {
        return "123";
      }

      throw new Error(`Unexpected input: ${name}`);
    });

    expect(getSolutionId()).toEqual("123");
  });

  it("should favor an explicit solution id as input over path", () => {
    mockedCore.getInput.mockImplementationOnce((name: string) => {
      if (name === "path") {
        return "src/utils/__mocks__/valid/valid-project.json";
      } else if (name === "solutionId") {
        return "123";
      }

      throw new Error(`Unexpected input: ${name}`);
    });

    expect(getSolutionId()).toEqual("123");
  });
});
