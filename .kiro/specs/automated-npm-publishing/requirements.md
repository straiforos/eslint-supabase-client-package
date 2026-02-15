# Requirements Document

## Introduction

This feature automates the npm package publishing workflow for eslint-plugin-supabase-services-layer. When code is merged to the main branch, the system will automatically determine the version bump, create a version tag, build, test, publish to npm, and create a GitHub release with generated release notes.

## Glossary

- **CI_System**: The GitHub Actions continuous integration system
- **Package_Registry**: The npm package registry where packages are published
- **Version_Tag**: A git tag following semantic versioning format (e.g., v2.0.1, v2.1.0)
- **Version_Bump**: The type of version increment (major, minor, or patch) determined from commit messages
- **Conventional_Commits**: A commit message format that includes type prefixes (feat:, fix:, BREAKING CHANGE:)
- **Release_Notes**: Automatically generated documentation describing changes in a release
- **GitHub_Release**: A GitHub feature that packages code, release notes, and assets for a specific version
- **Build_Artifacts**: The compiled output in the dist/ directory produced by the build process
- **NPM_Token**: Authentication credential for publishing to npm registry

## Requirements

### Requirement 1: Automated Workflow Triggering

**User Story:** As a package maintainer, I want the publishing workflow to trigger automatically when code is merged to main, so that I don't have to manually manage releases.

#### Acceptance Criteria

1. WHEN a commit is pushed to the main branch, THE CI_System SHALL trigger the publishing workflow
2. WHEN a commit is pushed to a non-main branch, THE CI_System SHALL NOT trigger the publishing workflow
3. WHEN a pull request is opened or updated, THE CI_System SHALL NOT trigger the publishing workflow

### Requirement 2: Automatic Version Determination

**User Story:** As a package maintainer, I want the system to automatically determine the version bump based on commit messages, so that versioning follows semantic versioning conventions.

#### Acceptance Criteria

1. WHEN analyzing commits, THE CI_System SHALL detect commit messages following Conventional_Commits format
2. WHEN a commit message contains "feat:" or "feature:", THE CI_System SHALL determine a minor Version_Bump
3. WHEN a commit message contains "fix:" or "bugfix:", THE CI_System SHALL determine a patch Version_Bump
4. WHEN a commit message contains "BREAKING CHANGE:" or has "!" after the type, THE CI_System SHALL determine a major Version_Bump
5. WHEN multiple commits exist, THE CI_System SHALL select the highest priority Version_Bump (major > minor > patch)
6. WHEN no conventional commit messages are found, THE CI_System SHALL default to a patch Version_Bump
7. THE CI_System SHALL read the current version from package.json
8. THE CI_System SHALL calculate the new version by applying the Version_Bump to the current version

### Requirement 3: Version Tag Creation

**User Story:** As a package maintainer, I want version tags to be automatically created and pushed, so that releases are properly tracked in git history.

#### Acceptance Criteria

1. WHEN the new version is determined, THE CI_System SHALL update the version field in package.json
2. WHEN package.json is updated, THE CI_System SHALL commit the change with message "chore: bump version to vX.Y.Z"
3. WHEN the version commit is created, THE CI_System SHALL create a Version_Tag with format vX.Y.Z
4. WHEN the tag is created, THE CI_System SHALL push both the commit and tag to the repository
5. THE CI_System SHALL configure git with appropriate user name and email for automated commits

### Requirement 4: Build and Test Validation

**User Story:** As a package maintainer, I want the workflow to build and test the package before publishing, so that only validated code is released.

#### Acceptance Criteria

1. WHEN the publishing workflow runs, THE CI_System SHALL execute the build command (pnpm build)
2. WHEN the build command fails, THE CI_System SHALL halt the workflow and prevent publishing
3. WHEN the build succeeds, THE CI_System SHALL execute the test command (pnpm test)
4. WHEN the test command fails, THE CI_System SHALL halt the workflow and prevent publishing
5. WHEN both build and test succeed, THE CI_System SHALL proceed to publishing
6. THE CI_System SHALL use Node.js version 18 or higher as specified in package.json engines

### Requirement 5: Release Notes Generation

**User Story:** As a package maintainer, I want release notes to be automatically generated from commits and PRs, so that users can understand what changed in each version.

#### Acceptance Criteria

1. WHEN generating release notes, THE CI_System SHALL extract commit messages between the current tag and the previous tag
2. WHEN generating release notes, THE CI_System SHALL include PR titles and numbers for merged pull requests
3. WHEN generating release notes, THE CI_System SHALL categorize changes by type (features, fixes, breaking changes, documentation)
4. WHEN no previous tag exists, THE CI_System SHALL generate notes from all commits in the repository
5. THE CI_System SHALL format release notes in markdown format

### Requirement 6: NPM Package Publishing

**User Story:** As a package maintainer, I want the package to be automatically published to npm, so that users can install the latest version.

#### Acceptance Criteria

1. WHEN build and tests pass, THE CI_System SHALL authenticate with Package_Registry using NPM_Token
2. WHEN authentication succeeds, THE CI_System SHALL publish the package to Package_Registry
3. WHEN the package version already exists in Package_Registry, THE CI_System SHALL fail with a clear error message
4. WHEN publishing succeeds, THE CI_System SHALL verify the package is available on Package_Registry
5. THE CI_System SHALL publish using the npm publish command with appropriate registry configuration

### Requirement 7: GitHub Release Creation

**User Story:** As a package maintainer, I want a GitHub release to be created with the generated notes, so that users can view release information on GitHub.

#### Acceptance Criteria

1. WHEN npm publishing succeeds, THE CI_System SHALL create a GitHub_Release for the version tag
2. WHEN creating the release, THE CI_System SHALL attach the generated Release_Notes
3. WHEN creating the release, THE CI_System SHALL mark it as the latest release
4. WHEN creating the release, THE CI_System SHALL include the version number in the release title
5. IF the version is a pre-release (contains -alpha, -beta, -rc), THE CI_System SHALL mark the GitHub_Release as a pre-release

### Requirement 8: Error Handling and Notifications

**User Story:** As a package maintainer, I want to be notified when the publishing workflow fails, so that I can investigate and fix issues.

#### Acceptance Criteria

1. WHEN any step in the workflow fails, THE CI_System SHALL halt execution and report the failure
2. WHEN a failure occurs, THE CI_System SHALL provide clear error messages indicating which step failed
3. WHEN the workflow completes (success or failure), THE CI_System SHALL update the GitHub commit status
4. THE CI_System SHALL log all workflow steps for debugging purposes

### Requirement 9: Security and Credentials Management

**User Story:** As a package maintainer, I want credentials to be securely managed, so that the npm token is not exposed.

#### Acceptance Criteria

1. THE CI_System SHALL retrieve NPM_Token from GitHub repository secrets
2. THE CI_System SHALL NOT log or expose NPM_Token in workflow output
3. THE CI_System SHALL use GitHub's built-in GITHUB_TOKEN for GitHub API operations
4. THE CI_System SHALL restrict workflow permissions to the minimum required (contents: write, packages: write)
