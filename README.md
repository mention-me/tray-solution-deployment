# Tray Solution Deployment

A GitHub Action which can preview and publish Tray (formerly Tray.io, now Tray.ai) Solutions in a Tray organisation.

## Inputs

- `apiKey` - The API key for the Tray.ai account (**Required**)
- `region` - The region of the Tray.ai account. Options: `us1`, `eu1`, `apac1` (**Required**)
- `solutionId` - The ID of the solution to publish or preview. If not set, the path directly to a JSON export must be provided (**Optional**)
- `path` - The path to the JSON export of a project which contains the solution ID to use. If not set, the solution ID must be provided (**Optional**)
- `shouldPublish` - Whether the solution should be published (or just previewed). Options: `true`, `false` (**Optional**, default: `false`)

## Outputs

- `releaseId` - The ID of the release which was created (if the solution was published).
- `breakingChanges` - Whether the solution contains breaking changes when published.
- `requiresNewUserInput` - Whether the solution requires new user inputs after being published.
- `requiresNewSystemInput` - Whether the solution requires new system inputs after being published.

## Example usage

### Using a exported project JSON file

```yaml
uses: mention-me/tray-solution-deployment@v0.1.0
with:
  path: "path/to/connector/root/project.json"
  region: "us1"
  apiKey: ${{ secrets.TRAY_API_KEY }}
```

### Using a pre-defined Solution ID

```yaml
uses: mention-me/tray-solution-deployment@v0.1.0
with:
  solutionId: "1234-5678-101112"
  region: "us1"
  apiKey: ${{ secrets.TRAY_API_KEY }}
```

# Contributing

## Development

To develop this action, you can use the following commands:

- `npm install` - Install the dependencies
- `npm run test` - Run the tests
- `npm run bundle` - Update the distribution files (`./dist`). This is required before merging changes.

## Releasing

To release a new version of this action, you can do the following:

1. Update the version in `package.json` (and run `npm install` to update the lock file)
2. Run `npm run bundle` to update the distribution files
3. Commit the changes
4. Publish the [draft release](https://github.com/mention-me/tray-cdk-deployment/releases)
