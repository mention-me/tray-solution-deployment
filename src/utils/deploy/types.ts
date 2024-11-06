export type Preview = {
  breakingChanges: boolean;
  requiresNewUserInput: boolean;
  requiresNewSystemInput: boolean;
};

export type Publish = Preview & {
  releaseId: string;
};
