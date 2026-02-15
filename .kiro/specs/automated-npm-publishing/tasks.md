# Implementation Plan: Automated NPM Publishing

## Overview

This implementation sets up automated npm publishing using semantic-release and commitlint. The workflow triggers on pushes to main, automatically determines version bumps from conventional commits, generates changelogs, publishes to npm, and creates GitHub releases.

## Tasks

- [ ] 1. Set up commitlint for conventional commit enforcement
  - Install commitlint and husky dependencies
  - Create `.commitlintrc.json` configuration file
  - Set up husky git hooks for commit message validation
  - Add commitlint script to package.json
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 2. Configure semantic-release
  - [ ] 2.1 Install semantic-release and required plugins
    - Add semantic-release core and plugins to devDependencies
    - Install @semantic-release/changelog, @semantic-release/git, @semantic-release/github, @semantic-release/npm
    - _Requirements: 2.5, 2.8, 3.1, 5.1, 5.3, 5.5_
  
  - [ ] 2.2 Create semantic-release configuration file
    - Create `.releaserc.json` with plugin configuration
    - Configure branches (main), plugins order, and git commit message format
    - _Requirements: 2.5, 2.8, 3.2, 3.3_
  
  - [ ]* 2.3 Write unit tests for semantic-release configuration
    - Test configuration file is valid JSON
    - Test all required plugins are listed
    - Test branch configuration includes main
    - _Requirements: 2.5, 2.8_

- [ ] 3. Create GitHub Actions workflow
  - [ ] 3.1 Create workflow file structure
    - Create `.github/workflows/publish.yml`
    - Define workflow name, trigger (push to main), and permissions
    - _Requirements: 1.1, 1.2, 9.4_
  
  - [ ] 3.2 Add setup jobs
    - Configure Node.js setup (version 18.x)
    - Configure pnpm setup and caching
    - Add dependency installation step
    - _Requirements: 4.6_
  
  - [ ] 3.3 Add build and test steps
    - Add build step (pnpm build)
    - Add test step (pnpm test)
    - Configure failure handling (halt on error)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [ ] 3.4 Add semantic-release step
    - Configure npm authentication using NPM_TOKEN secret
    - Add semantic-release execution step
    - Configure git credentials for automated commits
    - Set GITHUB_TOKEN for GitHub API operations
    - _Requirements: 3.4, 3.5, 6.1, 6.2, 7.1, 7.2, 7.3, 9.1, 9.3_
  
  - [ ] 3.5 Add error handling and logging
    - Configure workflow to report failures clearly
    - Add step status checks
    - Configure commit status updates
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [ ]* 3.6 Write workflow validation tests
    - Test workflow YAML is valid
    - Test workflow has correct trigger configuration
    - Test workflow has correct permissions
    - Test Node.js version matches package.json engines
    - _Requirements: 1.1, 4.6, 9.4_

- [ ] 4. Checkpoint - Verify configuration files
  - Ensure all configuration files are created and valid
  - Verify commitlint, semantic-release, and workflow configurations
  - Ask the user if questions arise

- [ ] 5. Update package.json scripts and configuration
  - [ ] 5.1 Add prepare script for husky
    - Add "prepare": "husky install" to scripts
    - Ensures husky hooks are installed after npm install
    - _Requirements: 2.1_
  
  - [ ] 5.2 Update repository configuration
    - Verify repository URL is correct in package.json
    - Ensure package is configured for public access
    - _Requirements: 6.5_
  
  - [ ]* 5.3 Write property test for version calculation
    - **Property 3: Version Calculation Correctness**
    - **Validates: Requirements 2.8**
  
  - [ ]* 5.4 Write property test for commit parsing
    - **Property 1: Conventional Commit Type Detection**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**

- [ ] 6. Create documentation
  - [ ] 6.1 Update README with release process
    - Document conventional commit format requirements
    - Explain automated release workflow
    - Add badge for latest version
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [ ] 6.2 Create CONTRIBUTING.md
    - Document commit message guidelines
    - Explain how releases are triggered
    - Provide examples of conventional commits
    - _Requirements: 2.1_

- [ ] 7. Checkpoint - Test workflow locally
  - Ensure all tests pass
  - Verify commitlint works on sample commits
  - Ask the user if questions arise

- [ ] 8. Configure GitHub repository secrets
  - [ ] 8.1 Document required secrets
    - Create instructions for adding NPM_TOKEN to repository secrets
    - Document how to generate npm access token
    - _Requirements: 6.1, 9.1, 9.2_
  
  - [ ] 8.2 Add security documentation
    - Document token security best practices
    - Explain workflow permissions
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ]* 9. Write additional property tests
  - [ ]* 9.1 Write property test for version bump priority
    - **Property 2: Version Bump Priority Selection**
    - **Validates: Requirements 2.5**
  
  - [ ]* 9.2 Write property test for package.json round-trip
    - **Property 4: Package.json Version Round-trip**
    - **Validates: Requirements 2.7, 3.1**
  
  - [ ]* 9.3 Write property test for tag format consistency
    - **Property 5: Version Tag Format Consistency**
    - **Validates: Requirements 3.2, 3.3**
  
  - [ ]* 9.4 Write property test for commit categorization
    - **Property 8: Commit Categorization**
    - **Validates: Requirements 5.3**
  
  - [ ]* 9.5 Write property test for pre-release detection
    - **Property 11: Pre-release Detection**
    - **Validates: Requirements 7.5**
  
  - [ ]* 9.6 Write property test for token masking
    - **Property 13: Token Masking**
    - **Validates: Requirements 9.2**

- [ ] 10. Final checkpoint - Ready for first release
  - Ensure all configuration is complete
  - Verify NPM_TOKEN is configured in GitHub secrets
  - Confirm workflow file is committed to main branch
  - Ask the user if they're ready to test the workflow with a real commit

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The workflow will not run until NPM_TOKEN is added to GitHub repository secrets
- First release should be tested in a fork or test repository before using in production
- semantic-release handles most of the complexity automatically
- commitlint ensures all commits follow conventional format, enabling accurate version bumps
- The workflow uses GitHub's built-in GITHUB_TOKEN for most operations
- Only NPM_TOKEN needs to be manually configured as a repository secret
