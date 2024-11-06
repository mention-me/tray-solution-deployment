import { parse } from "../parse";

describe("Given a project file to parse", () => {
  it("should handle a valid project file", () => {
    expect(parse("src/utils/__mocks__/valid/valid-project.json")).toEqual({
      solution: {
        id: "999",
      },
    });
  });

  it("should handle a invalid project file", () => {
    expect(() =>
      parse("src/utils/__mocks__/invalid/missing-solution.json"),
    ).toThrow(`The project JSON file does not have a solution ID`);
  });

  it("should handle a missing file", () => {
    expect(() =>
      parse("src/utils/__mocks__/not-a-valid-path/some-project.json"),
    ).toThrow(
      "Project file not found at path: src/utils/__mocks__/not-a-valid-path/some-project.json",
    );
  });
});
